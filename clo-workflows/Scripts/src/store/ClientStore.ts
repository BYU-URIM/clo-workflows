import { action, ObservableMap, observable, runInAction, computed, IObservableArray } from "mobx"
import { autobind } from "core-decorators"
import { FormEntryType, CloRequestElement, PROJECT_TYPES, WORK_TYPES } from "../model/CloRequestElement"
import { IFormControl } from "../model/FormControl"
import { getView, getStep, getStepNames } from "../model/loader/resourceLoaders"
import { IDataService } from "../service/dataService/IDataService"
import { validateFormControl, getFormattedDate } from "../utils"
import { RootStore } from "./RootStore"
import { User, IUser } from "../model/User"
import { getNextStepName, StepName } from "../model/Step"
import { IWork } from "../model/Work"
import { IProjectGroup } from "../component/ProjectProcessList"
import { ObservableArray } from "mobx/lib/types/observablearray"

type ClientObsMap = ObservableMap<FormEntryType>

@autobind
export class ClientStore {
    /* current user object */
    @observable currentUser: IUser = this.root.sessionStore.currentUser
    /* observable object to store data for new project as it is received, provides values for controlled create forms */
    @observable newProject: ClientObsMap
    /* observable object to store data for new process as it is received, provides values for controlled create forms */
    @observable newProcess: ClientObsMap
    /* observable object to store data for new work as it is received, provides values for controlled create forms */
    @observable newWork: ClientObsMap
    /* all of the projects ever created by the currentUser */
    @observable
    spData: {
        projects: IObservableArray<any>
        processes: IObservableArray<any>
        works: IObservableArray<any>
    }

    /*********** observables for viewState *************/

    @observable clientSelections?: ClientObsMap
    /* the selected project type, defaults to undefined */
    @observable selectedProjectType?: string = undefined
    /* the selected work type, defaults to undefined */
    @observable selectedWorkId: number
    /* should the project modal be visible or not */
    @observable selectedWorkType: string = undefined
    /* the project to add process to */
    @observable selectedProjectId: string
    /* the currently selected work when adding a process to a project */
    @observable showProjectModal: boolean = false
    /* should the process modal be visible or not */
    @observable showProcessModal: boolean = false
    /* is the work on the new process new */
    @observable workIsNew: boolean = false
    /* what is the message to show? */
    @observable message: any
    /* boolean value indicating if the inputs should all be disabled , use while awaiting http requests */
    @observable asyncPendingLockout: boolean

    @observable
    selected: {
        projectId: string
        projectType: string
        workId: string
        workType: string
    }
    /************************************************
     * #######################
     * ##### Actions TOC #####
     * #######################
     * # init tasks
     * # utility functions
     * # dataService interactions #
     *
     ************************************************/

    constructor(private root: RootStore, private dataService: IDataService) {}

    @action
    async init(): Promise<void> {
        this.spData = {
            processes: observable.array(),
            projects: observable.array(),
            works: observable.array(),
        }
        await this.fetchClientProcesses()
        await this.fetchClientProjects()
        await this.fetchWorks()

        this.currentUser = this.root.sessionStore.currentUser

        await this.initInputMaps()
        this.setAsyncPendingLockout(false)
    }

    private initInputMaps = (): void => {
        this.newProject = this.getClientObsMap()
        this.newWork = this.getClientObsMap()
        this.newProcess = this.getClientObsMap()
    }

    private initUIDescriptors = (): void => {
        this.clientSelections = this.getClientObsMap()
    }

    private getClientObsMap = (): ClientObsMap => observable.map([["submitterId", this.currentUser.Id]])

    @action
    async updateClientStoreMember(fieldName: string, newVal: FormEntryType | boolean, objToUpdate?: string) {
        objToUpdate ? this[objToUpdate].set(fieldName, newVal) : (this[fieldName] = newVal)
    }
    @action
    async submitProject(): Promise<void> {
        this.setAsyncPendingLockout(true)
        this.newProject.set("type", this.viewState.selectedProjectType)
        try {
            await this.dataService.createProject(this.newProject.toJS())
            // runInAction(() => this.spData.projects.push(projectDetails))
            this.postMessage({ messageText: "project successfully created", messageType: "success" })
        } catch (error) {
            console.error(error)
            this.postMessage({ messageText: "there was a problem creating your new Project, try again", messageType: "error" })
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @action
    async submitWork(): Promise<void> {
        this.setAsyncPendingLockout(true)
        try {
            this.newWork.set("type", this.selectedWorkType)
            const work = await this.dataService.createWork(this.newWork.toJS())
            this.updateClientStoreMember("selectedWorkId", work.data.Id.toString())
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
    async submitProcess(): Promise<void> {
        this.setAsyncPendingLockout(true)
        try {
            // processDetails.step = getNextStepName(processDetails, "Intake")
            this.newProcess.set("step", "Intake")
            this.workIsNew
                ? this.newProcess.set("Title", this.newWork.get("Title"))
                : this.newProcess.set("Title", this.spData.works.find(work => work.Id === this.selectedWorkId).Title)
            this.newProcess.set("workId", this.selectedWorkId.toString())
            console.log(this.newProcess)
            await this.dataService.createProcess(this.newProcess.toJS())
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
            runInAction(() => this.spData.processes.push(this.newProcess.toJS()))
            this.cleanProjects(Array.from(this.spData.projects))
            this.getCounts()
            this.updateClientStoreMember("showProcessModal", false)
        }
    }

    @action
    async processClientRequest() {
        if (this.workIsNew) await this.submitWork()
        await this.submitProcess()
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
        this.newWork.set("submitterId", this.currentUser.Id)
        this.updateViewState("showProcessModal", true)
    }

    @action
    fetchClientProjects = async () => {
        const projects = await this.dataService.fetchClientProjects(this.currentUser.Id)
        runInAction(() => this.cleanProjects(projects))
    }

    @action
    cleanProjects = projects => {
        this.spData.projects = projects
            .map((proj: CloRequestElement, i): IProjectGroup => {
                console.log(proj)
                return {
                    key: i.toString(),
                    data: {
                        projectId: proj.Id,
                    },
                    Title: proj.Title.toString(),
                    name: proj.Title.toString(),
                    count: this.getProcessCount(proj),
                    submitterId: proj.submitterId.toString(),
                    startIndex: 0,
                    isShowingAll: false,
                }
            })
            .map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })
    }

    @action
    getCounts = () => {
        this.spData.projects = observable.array(
           this.spData.projects.map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })
        )
    }

    @action
    getProcessCount(proj: CloRequestElement) {
        console.log(proj)
        // @ts-ignore
        const id = proj.Id ? proj.Id : proj.data.projectId
        return this.clientProcesses.filter(proc => {
            // @ts-ignore
            return id.toString() === proc.projectId
        }).length
    }
    @action
    fetchClientProcesses = async () => {
        const processes = await this.dataService.fetchClientProcesses(this.currentUser.Id)
        this.spData.processes = observable.array(
            processes.map((proc, i) => {
                return {
                    key: i.toString(),
                    Id: proc.Id,
                    projectId: proc.projectId,
                    Title: proc.Title,
                    step: `${proc.step} - ${getStep(proc.step as StepName).stepId} out of ${getStepNames().length}`,
                }
            })
        )
    }
    @action
    fetchWorks = async () => {
        this.spData.works = observable.array(await this.dataService.fetchWorks())
    }
    @action
    updateMember = (m: string, v?: any) => {
        !v ? (this[m] = !this[m]) : (this[m] = v)
    }
    @action
    updateViewState = (m: string, v?: string | boolean | undefined) => {
        v ? (this[m] = v) : (this[m] = undefined)
    }

    @action
    setAsyncPendingLockout(val: boolean) {
        this.asyncPendingLockout = val
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

    /************ Computed Values ****************/

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
        return this.spData.processes.sort((a, b) => Number(a.projectId) - Number(b.projectId))
    }
    @computed
    get clientProjects() {
        return this.spData.projects
    }
}
