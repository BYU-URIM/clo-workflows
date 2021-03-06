import { action, ObservableMap, observable, runInAction, computed } from "mobx"
// import { autobind } from "core-decorators"
import {
    FormEntryType,
    CloRequestElement,
    PROJECT_TYPES,
    WORK_TYPES,
    FormControl,
    IUser,
    getNextStepName,
    StepName,
    IStep,
    INote,
    NoteSource,
    NoteScope,
    getView,
    getStep,
} from "../../model"
import { IDataService } from "../../service"
import Utils from "../../utils"
import { StoreUtils, RootStore, ClientViewState, ClientStoreData, NotesStore } from ".."
import { IViewProvider, IMessage } from "../ViewProvider"
import { IListItem } from "../../components"

type ClientObsMap = ObservableMap<FormEntryType>

// @autobind
export class ClientStore implements IViewProvider {
    @observable searchedWorks: ObservableMap<CloRequestElement> = new ObservableMap()
    // @observable searchedProjects: ObservableMap<CloRequestElement>
    // @observable searchedProcesses: ObservableMap<CloRequestElement>
    @observable currentUser: IUser = this.root.sessionStore.currentUser
    /* Observable maps to store the info entered that is not state */
    @observable newProject: ClientObsMap
    @observable newProcess: ClientObsMap
    @observable newWork: ClientObsMap
    /* any message to be shown in the view */
    @observable message: IMessage
    /* ------------------------------------------------------------ *
     * - data stores fetched data and GET api calls
     * - view stores user interactions that ui is derived from
     * ------------------------------------------------------------ */
    data: ClientStoreData = new ClientStoreData(this.dataService, this.currentUser)
    view: ClientViewState = new ClientViewState()
    constructor(public root: RootStore, private dataService: IDataService) {
        this.newProject = StoreUtils.getClientObsMap(this.currentUser.Id, { status: "Active" })
        this.newProcess = StoreUtils.getClientObsMap(this.currentUser.Id)
        this.newWork = StoreUtils.getClientObsMap(this.currentUser.Id)
        this.data = new ClientStoreData(this.dataService, this.currentUser)
        this.view = new ClientViewState()
        this.currentUser = this.root.sessionStore.currentUser
    }

    @action init = async (): Promise<void> => this.data.init()

    /* ------------------------------------------------------------
     * Mutations to ClientViewState
     * ------------------------------------------------------------ *\

    /* function to update view state on this.view */
    /* this replaces the entire current view with a new instance */
    @action
    clearState = () => {
        this.newProject = StoreUtils.getClientObsMap(this.currentUser.Id, { status: "Active" })
        this.newProcess = StoreUtils.getClientObsMap(this.currentUser.Id)
        this.newWork = StoreUtils.getClientObsMap(this.currentUser.Id)
        this.view.resetClientState()
    }

    @action
    postMessage = (message: any, displayTime: number = 5000) => {
        this.message = message
        setTimeout(
            action(() => {
                this.message = null
            }),
            displayTime
        )
    }

    @action
    setAsyncPendingLockout = (val: boolean) => {
        this.asyncPendingLockout = val
    }

    /* ------------------------------------------------------------ *
     *                  Computed Values for view
     * ------------------------------------------------------------ */
    @computed
    get currentForm(): Array<FormControl> {
        return this.view.work.type || this.view.project.type
            ? [...getView(this.view.work.type || this.view.project.type, this.root.sessionStore.currentUser.primaryRole).formFields]
            : undefined
    }

    @computed
    get useForm(): Array<FormControl> {
        return this.view.work.type || this.view.project.type
            ? [...getView(this.view.work.type || this.view.project.type, this.root.sessionStore.currentUser.primaryRole).useFields]
            : undefined
    }

    @computed
    get currentFormValidation(): {} {
        const typeToValidate = this.currentForm
        const newInstanceOfType = this.view.modal === "project" ? this.newProject : this.newWork
        return StoreUtils.validateFormControlGroup(typeToValidate, newInstanceOfType)
    }

    @computed
    get useFormValidation(): {} {
        const typeToValidate = this.useForm
        const newInstanceOfType = this.newProcess
        return StoreUtils.validateFormControlGroup(typeToValidate, newInstanceOfType)
    }

    @computed
    get currentProcessFormIsValid(): boolean {
        return (
            !!this.view.work.type &&
            !this.asyncPendingLockout &&
            Utils.isObjectEmpty(this.currentFormValidation) &&
            this.currentForm.filter(fc => fc.required).filter(fc => !this.newWork.has(fc.dataRef)).length === 0
        )
    }

    @computed
    get currentProjectFormIsValid(): boolean {
        return (
            !!this.view.project.type &&
            !this.asyncPendingLockout &&
            Utils.isObjectEmpty(this.currentFormValidation) &&
            this.currentForm.filter(fc => fc.required).filter(fc => !this.newProject.has(fc.dataRef)).length === 0
        )
    }

    @observable asyncPendingLockout: boolean

    @computed
    get typesAsOptions() {
        return {
            PROJECTS: PROJECT_TYPES.map(e => ({
                key: e,
                value: e,
                text: e,
            })),
            WORKS: WORK_TYPES.map(e => ({
                key: e,
                value: e,
                text: e,
            })),
        }
    }

    @computed
    get selectedNotes() {
        return this.view.notesType === NoteSource.PROJECT
            ? this.data.projectNotesByProjectId.get(this.view.project.id) || []
            : this.data.workNotesByWorkId.get(this.view.work.id) || []
    }

    @computed
    get selectedNotesStore() {
        return this.view.notesType === NoteSource.PROJECT
            ? // create projects notes store
              new NotesStore({
                  viewProvider: this,
                  dataService: this.dataService,
                  source: NoteSource.PROJECT,
                  maxScope: NoteScope.CLIENT,
                  notes: this.selectedNotes,
                  attachedClientId: this.root.sessionStore.currentUser.Id,
                  attachedProjectId: Number(this.view.project.id),
              })
            : // create works notes store
              new NotesStore({
                  viewProvider: this,
                  dataService: this.dataService,
                  source: NoteSource.WORK,
                  maxScope: NoteScope.CLIENT,
                  notes: this.selectedNotes,
                  attachedClientId: this.root.sessionStore.currentUser.Id,
                  attachedWorkId: Number(this.view.work.id),
              })
    }

    @computed
    get searchedWorkBriefs(): Array<IListItem> {
        return Object.values(this.searchedWorks.toJS()).map(
            (work): IListItem => {
                return {
                    header: String(work.Title || ""),
                    body: String(work.body || ""),
                    id: work.Id,
                    selectable: work.Id === 0 ? false : true,
                }
            }
        )
    }

    /* ------------------------------------------------------------ *
     *                  Other Class Actions
     * ------------------------------------------------------------ */

    /* function to update class members of type ObservableMap */
    @action
    updateClientStoreMember = async (fieldName: string, newVal: FormEntryType | boolean, objToUpdate?: string) => {
        objToUpdate ? this[objToUpdate].set(fieldName, newVal) : (this[fieldName] = newVal)
    }

    @action
    clearSearchResults = () => {
        this.searchedWorks = new ObservableMap<CloRequestElement>()
    }
    /* determines which request the user is making from the ViewState */
    @action
    processClientRequest = async () => {
        this.view.project.type
            ? await this.submitProject()
            : this.view.work.isNew
                ? (await this.submitWork(), await this.submitProcess())
                : await this.submitProcess()
        this.view.resetClientState()
    }

    @action
    handleAddNewProcess = (projectId: string) => {
        this.newProcess.set("projectId", projectId)
        this.view.modal = "process"
    }

    /* ------------------------------------------------------------ *
     * DataService Requests
     * ------------------------------------------------------------ */

    /* POST's */

    @action
    private submitProject = async (): Promise<void> => {
        this.newProject.set("type", this.view.project.type)
        try {
            this.setAsyncPendingLockout(true)
            await this.dataService.createProject(this.newProject.toJS())
            this.clearState()
            this.postMessage({ messageText: "project successfully created", messageType: "success" })
            await this.data.fetchClientProjects()
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem creating your new Project, try again",
                messageType: "error",
            })
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @action
    private submitWork = async (): Promise<void> => {
        try {
            this.setAsyncPendingLockout(true)
            this.newWork.set("type", this.view.work.type)
            const res = await this.dataService.createWork(this.newWork.toJS())
            this.view.work.id = res.data.Id
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Process request, try again",
                messageType: "error",
            })
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @action
    private submitProcess = async (): Promise<void> => {
        try {
            this.setAsyncPendingLockout(true)
            const previousStep: IStep = getStep("Intake")
            const nextStepName: StepName = getNextStepName(this.newProcess.toJS(), "Intake")
            this.newProcess.set("step", nextStepName)
            this.view.work.isNew
                ? this.newProcess.set("Title", this.newWork.get("Title"))
                : this.newProcess.set("Title", this.searchedWorks.get(this.view.work.id).Title)
            this.newProcess.set("workId", this.view.work.id.toString())
            this.newProcess.set(previousStep.submissionDateFieldName, Utils.getFormattedDate())
            this.newProcess.set(previousStep.submitterFieldName, this.root.sessionStore.currentUser.name)
            await this.dataService.createProcess(this.newProcess.toJS())
            await this.data.fetchClientProcesses()
            // this.newProcess.set("Id", res.data.Id)
            // runInAction(() => this.data.processes.push(this.newProcess.toJS()))
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
            this.setAsyncPendingLockout(false)
        }
    }
    @action
    search = async (searchTerm: string) => {
        const works = await this.dataService.searchWorksByTitle(searchTerm, this.view.work.type)
        works.filter(work => !this.data.currentProjectWorkIds(this.view.project.id).includes(work.Id))

        runInAction(() => {
            this.searchedWorks =
                StoreUtils.mapRequestElementArrayById(
                    works.filter(work => !this.data.currentProjectWorkIds(this.view.project.id).includes(work.Id.toString()))
                ) || observable.map()
        })
    }

    /* ------------------------------------------------------------ *
     * NOTES - SHARED BY PROJECTS AND WORKS
     * ------------------------------------------------------------ */
    @action
    submitNewNote = async (noteToCreate: INote, noteSource: NoteSource): Promise<boolean> => {
        let submissionStatus = true
        try {
            this.setAsyncPendingLockout(true)
            // fill in any info the new note needs before submission
            noteToCreate.dateSubmitted = Utils.getFormattedDate()
            noteToCreate.submitter = this.root.sessionStore.currentUser.name
            if (noteToCreate.scope === NoteScope.CLIENT) {
                noteToCreate.attachedClientId = this.newProcess.get("submitterId") as string
            }

            if (noteSource === NoteSource.PROJECT) {
                noteToCreate.projectId = String(this.view.project.id)
            } else if (noteSource === NoteSource.WORK) {
                noteToCreate.workId = String(this.view.work.id)
            }

            const addResult = await this.dataService.createNote(noteToCreate)
            noteToCreate.Id = addResult.data.Id // assign the assigned SP ID to the newly created note

            await this.data.fetchNotes()
            this.postMessage({ messageText: "note successfully submitted", messageType: "success" })
        } catch (error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({
                messageText: "there was a problem submitting your note, try again",
                messageType: "error",
            })
        } finally {
            this.asyncPendingLockout = false
        }

        return submissionStatus
    }

    @action
    updateNote = async (noteToUpdate: INote, noteSource: NoteSource): Promise<boolean> => {
        let submissionStatus = true
        try {
            this.asyncPendingLockout = true
            noteToUpdate.dateSubmitted = Utils.getFormattedDate()
            await this.dataService.updateNote(noteToUpdate)

            // if submission is successful, add the new note to the corresponding list
            await this.data.fetchNotes()
            this.postMessage({ messageText: "note successfully updated", messageType: "success" })
        } catch (error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({ messageText: "there was a problem updating your note, try again", messageType: "error" })
        } finally {
            this.asyncPendingLockout = false
        }

        return submissionStatus
    }
    @action
    deleteNote = async (noteToDelete: INote, noteSource: NoteSource): Promise<boolean> => {
        let submissionStatus = true

        try {
            this.asyncPendingLockout = true
            await this.dataService.deleteNote(noteToDelete.Id)
            // if deletion is successful, remove the new note from the corresponding list
            if (noteSource === NoteSource.PROJECT) this.removeELementInListById(noteToDelete, this.data.process_notes)
            if (noteSource === NoteSource.WORK) this.removeELementInListById(noteToDelete, this.data.process_notes)
            this.postMessage({ messageText: "note successfully deleted", messageType: "success" })
        } catch (error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({ messageText: "there was a problem deleting your note, try again", messageType: "error" })
        } finally {
            this.asyncPendingLockout = false
        }
        return submissionStatus
    }

    @action
    private removeELementInListById = (itemToDelete: CloRequestElement | INote, list: Array<CloRequestElement | INote>) => {
        list.splice(list.findIndex(listItem => listItem["Id"] === listItem["Id"]), 1 /*remove 1 elem*/)
    }
}
