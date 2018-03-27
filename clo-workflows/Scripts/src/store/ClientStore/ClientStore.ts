import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { autobind } from "core-decorators"
import { FormEntryType, CloRequestElement, PROJECT_TYPES, WORK_TYPES } from "../../model/CloRequestElement"
import { IFormControl } from "../../model/FormControl"
import { getView, getStep, getStepNames } from "../../model/loader/resourceLoaders"
import { IDataService } from "../../service/dataService/IDataService"
import { validateFormControl, getFormattedDate } from "../../utils"
import { RootStore } from "../RootStore"
import { User, IUser } from "../../model/User"
import { getNextStepName, StepName } from "../../model/Step"
import { IProjectGroup } from "../../component/ProjectProcessList"
import { ClientViewState, ClientStoreData } from "./"
import { INote, NoteSource, NoteScope } from "../../model/Note"

type ClientObsMap = ObservableMap<FormEntryType>

@autobind
export class ClientStore {
    @observable currentUser: IUser = this.root.sessionStore.currentUser
    /* Observable maps to store the info entered that is not state */
    @observable newProject: ClientObsMap = this.getClientObsMap()
    @observable newProcess: ClientObsMap = this.getClientObsMap()
    @observable newWork: ClientObsMap = this.getClientObsMap()
    /* fetched data */
    @observable projects: Array<any> = []
    @observable processes: Array<any> = []
    @observable notes: Array<any>
    @observable works: Array<any> = []
    /* any message to be shown in the view */
    @observable message: any

    /* Object used to store all view related state */
    view: ClientViewState = new ClientViewState()
    data: ClientStoreData = new ClientStoreData(this.dataService, this.currentUser)

    constructor(private root: RootStore, private dataService: IDataService) {}

    @action
    async init(): Promise<void> {
        this.currentUser = this.root.sessionStore.currentUser
        await this.fetchClientProcesses()
        await this.fetchClientProjects()
        await this.fetchWorks()
    }

    /*********************************************************
     * Mutations to ClientViewState
     *********************************************************/

    /* function to update view state on this.view */
    /* this replaces the entire cirrent view with a new instance */
    @action
    clearState = () => {
        this.newProject = this.getClientObsMap()
        this.newProcess = this.getClientObsMap()
        this.newWork = this.getClientObsMap()
        this.view.resetClientState()
    }

    @action
    postMessage(message: any, displayTime: number = 5000) {
        this.message = message
        setTimeout(
            action(() => {
                this.message = null
            }),
            displayTime
        )
    }

    /*********************************************************
     * Computed Values for view
     *********************************************************/
    @computed
    get currentForm(): Array<IFormControl> {
        return getView(this.view.workType || this.view.projectType).formControls
    }

    @computed
    get currentFormValidation(): {} {
        const typeToValidate = this.currentForm
        const newInstanceOfType = this.newWork || this.newProject
        return typeToValidate.reduce((accumulator: {}, formControl: IFormControl) => {
            const fieldName: string = formControl.dataRef
            const inputVal = newInstanceOfType.get(fieldName) || undefined
            const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
            accumulator[fieldName] = error
            return accumulator
        }, {})
    }

    @computed
    get clientProcesses() {
        return this.processes
            .map((proc, i) => {
                return {
                    key: i.toString(),
                    Id: proc.Id,
                    projectId: proc.projectId,
                    title: proc.Title,
                    step: `${proc.step} - ${getStep(proc.step as StepName).stepId} out of ${getStepNames().length}`,
                }
            })
            .sort((a, b) => Number(a.projectId) - Number(b.projectId))
    }

    @computed
    get clientProjects() {
        return this.projects
            .map((proj: CloRequestElement, i): IProjectGroup => ({
                key: i.toString(),
                projectId: proj.Id.toString(),
                Title: proj.Title.toString(),
                name: proj.Title.toString(),
                count: this.processes.filter(proc => proj.Id.toString() === proc.projectId).length,
                submitterId: proj.submitterId.toString(),
                startIndex: 0,
                isShowingAll: false,
            }))
            .map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })
    }

    @computed
    get typesAsOptions() {
        return {
            PROJECTS: PROJECT_TYPES.map(e => ({
                key: e,
                text: e,
            })),
            WORKS: WORK_TYPES.map(e => ({
                key: e,
                text: e,
            })),
        }
    }

    /*********************************************************
     * Other Class Actions
     *********************************************************/

    /* function to update class members of type ObservableMap */
    @action
    async updateClientStoreMember(fieldName: string, newVal: FormEntryType | boolean, objToUpdate?: string) {
        objToUpdate ? this[objToUpdate].set(fieldName, newVal) : (this[fieldName] = newVal)
    }
    /* determines which request the user is making from the ViewState */
    @action
    async processClientRequest() {
        this.view.projectType
            ? await this.submitProject()
            : this.view.workIsNew ? (await this.submitWork(), await this.submitProcess()) : await this.submitProcess()
        this.view = new ClientViewState()
    }

    @action
    handleAddNewProcess(projectId: string) {
        this.newProcess.set("projectId", projectId)
        this.view.showProcessModal = true
    }

    private getClientObsMap(): ClientObsMap {
        return observable.map([["submitterId", this.currentUser.Id]])
    }

    /*********************************************************
     * DataService Requests
     *********************************************************/

    /* GET's */

    @action
    private fetchClientProcesses = async () => {
        this.processes = await this.dataService.fetchClientProcesses(this.currentUser.Id)
    }

    @action
    private fetchClientProjects = async () => {
        this.projects = await this.dataService.fetchClientProjects(this.currentUser.Id)
    }

    @action
    private fetchWorks = async () => {
        this.works = observable.array(await this.dataService.fetchWorks())
    }

    @action
    fetchNotesForSelected = async () => {
        this.notes
    }

    /* POST's */

    @action
    private async submitProject(): Promise<void> {
        this.view.asyncPendingLockout = true
        this.newProject.set("type", this.view.projectType)
        try {
            const res = await this.dataService.createProject(this.newProject.toJS())
            this.newProject.set("Id", res.data.Id)
            runInAction(() => this.projects.push(this.newProject.toJS()))
            this.clearState()
            this.postMessage({ messageText: "project successfully created", messageType: "success" })
        } catch (error) {
            console.error(error)
            this.postMessage({ messageText: "there was a problem creating your new Project, try again", messageType: "error" })
        } finally {
            this.view.asyncPendingLockout = false
        }
    }

    @action
    private async submitWork(): Promise<void> {
        this.view.asyncPendingLockout = true
        try {
            this.newWork.set("type", this.view.workType)
            const res = await this.dataService.createWork(this.newWork.toJS())
            this.updateClientStoreMember("selectedWorkId", res.data.Id.toString())
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Process request, try again",
                messageType: "error",
            })
        } finally {
            this.view.asyncPendingLockout = false
        }
    }

    @action
    private async submitProcess(): Promise<void> {
        this.view.asyncPendingLockout = true
        try {
            // processDetails.step = getNextStepName(processDetails, "Intake")
            this.newProcess.set("step", "Intake")
            this.view.workIsNew
                ? this.newProcess.set("Title", this.newWork.get("Title"))
                : this.newProcess.set("Title", this.works.find(work => work.Id.toString() === this.view.workId).Title)
            this.newProcess.set("workId", this.view.workId)
            const res = await this.dataService.createProcess(this.newProcess.toJS())
            this.newProcess.set("Id", res.data.Id)
            runInAction(() => this.processes.push(this.newProcess.toJS()))
            this.clearState()
            this.postMessage({
                messageText: "the new Process request was submitted successfully",
                messageType: "success",
            })
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Process request, try again",
                messageType: "error",
            })
        } finally {
            this.view.asyncPendingLockout = false
        }
    }

    /*******************************************************************************************************/
    // NOTES - SHARED BY RPOJECTS AND WORKS
    /*******************************************************************************************************/
    // @action async submitNewNote(noteToCreate: INote, noteSource: NoteSource): Promise<boolean> {
    //     this.view.updateView("asyncPendingLockout",true)

    //     let submissionStatus = true
    //     try {
    //         // fill in any info the new note needs before submission
    //         noteToCreate.dateSubmitted = getFormattedDate()
    //         noteToCreate.submitter = this.root.sessionStore.currentUser.name
    //         if(noteToCreate.scope === NoteScope.CLIENT) {
    //             noteToCreate.attachedClientId = this.newProcess.get("submitterId") as string
    //         }

    //         if(noteSource === NoteSource.PROJECT) {
    //             noteToCreate.projectId = String(this.view.projectId)
    //         } else if(noteSource === NoteSource.WORK) {
    //             noteToCreate.workId = String(this.view.workId)
    //         }

    //         const addResult = await this.dataService.createNote(noteToCreate)
    //         noteToCreate.Id = addResult.data.Id // assign the assigned SP ID to the newly created note

    //         // if submission is successful, add the new note to the corresponding list
    //         if(noteSource === NoteSource.WORK) runInAction(() => this.selectedWorkNotes.unshift(noteToCreate))
    //         if(noteSource === NoteSource.PROJECT) runInAction(() => this.selectedProjectNotes.unshift(noteToCreate))
    //         this.postMessage({messageText: "note successfully submitted", messageType: "success"})
    //     } catch(error) {
    //         console.error(error)
    //         submissionStatus = false
    //         this.postMessage({messageText: "there was a problem submitting your note, try again", messageType: "error"})
    //     } finally {
    //         this.view.updateView("asyncPendingLockout",false)
    //     }

    //     return submissionStatus
    // }

    // @action async updateNote(noteToUpdate: INote, noteSource: NoteSource): Promise<boolean> {
    //     this.view.updateView("asyncPendingLockout",true)
    //     let submissionStatus = true
    //     try {
    //         noteToUpdate.dateSubmitted = getFormattedDate()
    //         await this.dataService.updateNote(noteToUpdate)

    //         // if submission is successful, add the new note to the corresponding list
    //         if(noteSource === NoteSource.WORK) this.replaceElementInListById(noteToUpdate, this.selectedWorkNotes)
    //         if(noteSource === NoteSource.PROJECT) this.replaceElementInListById(noteToUpdate, this.selectedProjectNotes)

    //         this.postMessage({messageText: "note successfully updated", messageType: "success"})
    //     } catch(error) {
    //         console.error(error)
    //         submissionStatus = false
    //         this.postMessage({messageText: "there was a problem updating your note, try again", messageType: "error"})
    //     } finally {
    //         this.view.updateView("asyncPendingLockout",false)
    //     }

    //     return submissionStatus
    // }

    // @action async deleteNote(noteToDelete: INote, noteSource: NoteSource): Promise<boolean> {
    //     this.view.updateView("asyncPendingLockout",false)
    //     }
    //     return submissionStatus
    // }
}