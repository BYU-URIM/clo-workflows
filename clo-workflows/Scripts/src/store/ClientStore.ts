import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { autobind } from "core-decorators"
import { FormEntryType, CloRequestElement, PROJECT_TYPES, WORK_TYPES } from "../model/CloRequestElement"
import { IFormControl } from "../model/FormControl"
import { getView, getStep, getStepNames } from "../model/loader/resourceLoaders"
import { IDataService } from "../service/dataService/IDataService"
import { validateFormControl, getFormattedDate } from "../utils"
import { RootStore } from "./RootStore"
import { User } from "../model/User"
import { getNextStepName, StepName } from "../model/Step"
import { IWork } from "../model/Work"
import { IProjectGroup } from "../component/ProjectProcessList"

@autobind
export class ClientStore {
    constructor(private root: RootStore, private dataService: IDataService) {}
    @action
    async init(): Promise<void> {
        this.currentUser = this.root.sessionStore.currentUser
        this.client_processes = observable.array()
        this.client_projects = observable.array()
        await this.fetchClientProcesses()
        await this.fetchClientProjects()
        await this.fetchWorks()

        this.selectedProject = observable.map()
        this.newProject = observable.map()
        this.newProcess = observable.map()
        this.newWork = observable.map()
        this.setAsyncPendingLockout(false)
    }
    /* observable object to store data for new project as it is received, provides values for controlled create forms */
    @observable newProject: ObservableMap<FormEntryType>
    /* observable object to store data for new process as it is received, provides values for controlled create forms */
    @observable newProcess: ObservableMap<FormEntryType>
    /* observable object to store data for new work as it is received, provides values for controlled create forms */
    @observable newWork: ObservableMap<FormEntryType>
    /* all of the projects ever created by the currentUser */
    @observable projects: Array<CloRequestElement>
    /* all of the work requests that exist on the projects associated with the currentUser id */
    @observable processes: Array<CloRequestElement>
    /* the current works returned from the filtered works query */
    @observable works: Array<IWork>
    @observable client_processes: Array<{}>
    @observable client_projects: Array<IProjectGroup>

    /*********** observables for viewState *************/

    /* the selected project type, defaults to undefined */
    @observable selectedProjectType?: string = undefined
    /* the selected work type, defaults to undefined */
    @observable selectedWorkType: string = undefined
    /* the Selection object used to selectedProject */
    @observable selectedProject: ObservableMap<FormEntryType>
    /* the currently selected work when adding a process to a project */
    @observable selectedWork: number
    /* should the project modal be visible or not */
    @observable showProjectModal: boolean = false
    /* should the process modal be visible or not */
    @observable showProcessModal: boolean = false
    /* should the work modal be visible or not */
    @observable showWorkModal: boolean = false
    /* is the work on the new process new */
    @observable workIsNew: boolean = false

    /* current user object */
    currentUser

    /************ Computed Values ****************/

    @computed
    get ProjectTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedProjectType).formControls
    }
    @computed
    get WorkTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedWorkType).formControls
    }

    @computed
    get viewState() {
        return {
            selectedProject: this.selectedProject,
            selectedProjectType: this.selectedProjectType,
            selectedWorkType: this.selectedWorkType,
            selectedWork: {},
            projectTypeForm: (): Array<IFormControl> => this.ProjectTypeForm,
            workTypeForm: (): Array<IFormControl> => this.WorkTypeForm,
            showProjectModal: this.showProjectModal,
            showProcessModal: this.showProcessModal,
            message: this.message,
            workIsNew: this.workIsNew,
        }
    }

    @computed
    get DataService() {
        return this.dataService
    }

    @computed
    get TypesAsOptions() {
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

    @computed
    get CurrentFormValidation(): {} {
        const typeToValidate = this.selectedWorkType ? this.WorkTypeForm : this.ProjectTypeForm
        const newInstanceOfType = this.selectedWorkType ? this.newWork : this.newProject

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
        return this.client_processes
    }
    @computed
    get clientProjects() {
        return this.client_projects
    }
    /************ Actions ***************/
    @action
    async updateClientStoreMember(fieldName: string, newVal: FormEntryType | boolean, objToUpdate?: string) {
        objToUpdate ? this[objToUpdate].set(fieldName, newVal) : (this[fieldName] = newVal)
    }
    @action
    async submitNewProject(projectDetails): Promise<void> {
        this.setAsyncPendingLockout(true)
        try {
            projectDetails.submitterId = this.currentUser.Id
            projectDetails.type = this.viewState.selectedProjectType
            await this.dataService.createProject(projectDetails)
            runInAction(() => this.projects.push(projectDetails))
            this.postMessage({ messageText: "project successfully created", messageType: "success" })
        } catch (error) {
            console.error(error)
            this.postMessage({ messageText: "there was a problem creating your new Project, try again", messageType: "error" })
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @action
    async submitNewWork(workDetails): Promise<void> {
        this.setAsyncPendingLockout(true)
        try {
            workDetails.submitterId = this.currentUser.Id
            workDetails.type = this.viewState.selectedWorkType
            await this.dataService.createWork(workDetails)
            this.postMessage({ messageText: "new work request successfully created", messageType: "success" })
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Work request, try again",
                messageType: "error",
            })
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @action
    async submitProcess(processDetails: ObservableMap<FormEntryType> = this.newProcess): Promise<void> {
        this.setAsyncPendingLockout(true)
        this.newProcess.set("submitterId", this.currentUser.Id)
        try {
            // processDetails.step = getNextStepName(processDetails, "Intake")
            console.log(processDetails.toJS())
            await this.dataService.createProcess(processDetails.toJS())
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Process request, try again",
                messageType: "error",
            })
        } finally {
            this.setAsyncPendingLockout(false)
            runInAction(() => this.fetchClientProcesses())
            runInAction(() => this.fetchClientProjects())
        }
    }

    @action
    async submitNewWorkProcess() {
        this.setAsyncPendingLockout(true)
        if (this.workIsNew) {
            try {
                this.newWork.set("type", this.selectedWorkType)
                console.log(this.newWork)
                await this.dataService.createWork(this.newWork.toJS()).then(work => {
                    console.log(work)
                    this.selectedWork = work.data.Id.toString()
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
        try {
            // processDetails.step = getNextStepName(processDetails, "Intake")
            this.newProcess.set("step", "Intake")
            this.workIsNew
                ? this.newProcess.set("Title", this.newWork.get("Title"))
                : this.newProcess.set("Title", this.works.find(work => work.Id === this.selectedWork).Title)
            this.newProcess.set("workId", this.selectedWork.toString())
            await this.submitProcess()
        } catch (error) {
            console.error(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Process request, try again",
                messageType: "error",
            })
        } finally {
            this.setAsyncPendingLockout(false)
            this.postMessage({
                messageText: "the new Process request was submitted successfully",
                messageType: "success",
            })
            this.updateClientStoreMember("showProcessModal", false)
        }
    }

    @action
    closeProjectModal() {
        this.newProject = observable.map()
        this.selectedProjectType = undefined
        this.showProjectModal = false
    }

    @action
    closeProcessModal() {
        this.newProcess = observable.map()
        this.selectedWorkType = undefined
        this.workIsNew = false
        this.showProcessModal = false
    }

    @action
    closeWorkForm() {
        this.newWork = observable.map()
        this.selectedWorkType = undefined
    }

    @action
    handleAddNewProcess(projectId: string) {
        this.newProcess.set("projectId", projectId)
        this.newProcess.set("submitterId", this.currentUser.Id)
        this.newWork.set("submitterId", this.currentUser.Id)
        this.updateViewState("showProcessModal", true)
    }

    @action
    fetchClientProjects = async () => {
        const projects = await this.dataService.fetchClientProjects(this.currentUser.Id)
        this.projects = projects
        runInAction(
            () =>
                (this.client_projects = projects
                    .map((proj: CloRequestElement, i): IProjectGroup => ({
                        key: i.toString(),
                        data: {
                            projectId: proj.Id,
                        },
                        name: proj.Title.toString(),
                        count: this.clientProcesses.filter(proc => {
                            // @ts-ignore
                            return proj.Id === Number(proc.projectId)
                        }).length,
                        submitterId: proj.submitterId.toString(),
                        startIndex: 0,
                        isShowingAll: false,
                    }))
                    .map((e, i, a) => {
                        i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                        return e
                    }))
        )
    }

    @action
    fetchClientProcesses = async () => {
        const processes = await this.dataService.fetchClientProcesses(this.currentUser.Id)
        this.processes = processes

        runInAction(
            () =>
                (this.client_processes = processes.map((proc, i) => {
                    return {
                        key: i.toString(),
                        Id: proc.Id,
                        projectId: proc.projectId,
                        Title: proc.Title,
                        step: `${proc.step} - ${getStep(proc.step as StepName).stepId} out of ${getStepNames().length}`,
                    }
                }))
        )
    }
    @action
    fetchWorks = async () => {
        this.works = await this.dataService.fetchWorks()
    }
    @action
    updateMember = (m: string, v?: any) => {
        !v ? (this[m] = !this[m]) : (this[m] = v)
    }
    @action
    updateViewState = (m: string, v?: string | boolean | undefined) => {
        v ? (this[m] = v) : (this[m] = undefined)
    }

    /* boolean value indicating if the inputs should all be disabled , use while awaiting http requests */
    @observable asyncPendingLockout: boolean

    @action
    setAsyncPendingLockout(val: boolean) {
        this.asyncPendingLockout = val
    }

    @observable message: any
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

    @action
    private clearSelectedRequestElements(): void {
        this.viewState.selectedProject.clear()
    }

    /* TODO: implement this */
    // finds the item with the with the same ID as the new item and replaces the stale item with the new item
    // true if replacement was successfull, false if not (stale list item was not found)
    @action
    private replaceElementInListById(newItem: CloRequestElement, list: Array<any>): boolean {
        const staleItemIndex = list.findIndex(listItem => listItem.Id === newItem.Id)

        if (staleItemIndex !== -1) {
            list[staleItemIndex] = newItem
            return true
        }
        return false
    }
}
