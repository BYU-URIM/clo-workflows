import { RootStore } from "./RootStore"
import { action, ObservableMap, observable, runInAction, computed, toJS } from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { IStep } from "../model/Step"
import { IItemBrief } from "../component/NonScrollableList"
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb"
import { validateFormControl, isObjectEmpty } from "../utils"
import { INote } from "../model/Note"
import { IDataService, ListName } from "../service/dataService/IDataService"
import { getView } from "../model/loader/resourceLoaders"

// stores all in-progress projects, processes, and works that belong the current employee's steps
@autobind
export class EmployeeStore {
    constructor(private root: RootStore, private dataService: IDataService) {}

    @action
    async init(): Promise<void> {
        const currentUser = this.root.sessionStore.currentUser
        this.processes = await this.dataService.fetchEmployeeActiveProcesses(currentUser)
        this.projects = await this.dataService.fetchRequestElementsById(this.processes.map(process => process.projectId as number), ListName.PROJECTS)
        this.works = await this.dataService.fetchRequestElementsById(this.processes.map(process => process.workId as number), ListName.WORKS)

        this.selectedProject = observable.map()
        this.selectedWork = observable.map()
        this.selectedProcess = observable.map()

        this.asyncPendingLockout = false
    }


    @observable
    private asyncPendingLockout: boolean
    
    @action setAsyncPendingLockout(val: boolean) {
        this.asyncPendingLockout = val
    }


    /*******************************************************************************************************/
    // WORKS
    @observable works: Array<ICloRequestElement>
    @observable selectedWork: ObservableMap<FormEntryType>

    @computed get selectedWorkFormControls(): Array<IFormControl> {
        return getView(this.selectedWork.get("type") as string).formControls
    }

    @action updateSelectedWork(fieldName: string, newVal: FormEntryType): void {
        this.selectedWork.set(fieldName, String(newVal))
    }

    @observable selectedWorkNotes: Array<INote> = []
    @observable selectedWorkNotesDisplayCount
    @action changeSelectedWorkNotesDisplayCount(amount: number): void {
        this.selectedWorkNotesDisplayCount += amount
    }

    @action
    async submitSelectedWork(): Promise<void> {
        this.setAsyncPendingLockout(true)

        try {
            await this.dataService.updateRequestElement(toJS(this.selectedWork) as any, ListName.WORKS)
        } catch(error) {
            console.log(error)
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitSelectedWork(): boolean {
        return !this.asyncPendingLockout
    }


    /*******************************************************************************************************/
    // PROJECTS
    @observable projects: Array<ICloRequestElement>
    @observable selectedProject: ObservableMap<FormEntryType>

    @computed
    get selectedProjectFormControls(): Array<IFormControl> {
        return getView(this.selectedProject.get("type") as string).formControls
    }

    @action
    updateSelectedProject(fieldName: string, newVal: FormEntryType): void {
        this.selectedProject.set(fieldName, String(newVal))
    }

    @observable selectedProjectNotes: Array<INote> = [
        {submitter: "employee name", dateSubmitted: "1/1/2015", text: "Sed ut perspiciatis unde omnis iste natus error sit", projectId: 1},
        {submitter: "employee name", dateSubmitted: "1/1/2013",
            text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis", projectId: 2},
        {submitter: "employee name", dateSubmitted: "1/1/2010",
            text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis", projectId: 2},
    ]

    @action
    async submitSelectedProject(): Promise<void> {
        this.setAsyncPendingLockout(true)

        try {
            await this.dataService.updateRequestElement(toJS(this.selectedProject) as any, ListName.PROJECTS)
        } catch(error) {
            console.log(error)
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitSelectedProject(): boolean {
        return !this.asyncPendingLockout
    }


    /*******************************************************************************************************/
    // STEPS
    @observable selectedStep: IStep
    @action
    selectStep(step: IStep): void {
        this.selectedStep = step
    }


    /*******************************************************************************************************/
    // PROCESSES
    @observable processes: Array<ICloRequestElement>
    @observable selectedProcess: ObservableMap<FormEntryType>

    // TODO project lookup should be more efficient, store as map ?
    @action async selectProcess(itemBrief: IItemBrief): Promise<void> {
        const selectedProcess: ICloRequestElement = this.processes.find(process => process.Id === itemBrief.id)
        this.selectedProcess = observable.map(selectedProcess)
        this.extendViewHierarchy(EmployeeViewKey.ProcessDetail)

        const selectedWork = this.works.find(work => work.Id === Number(this.selectedProcess.get("workId")))
        this.selectedWork = observable.map(selectedWork)

        const selectedProject = this.projects.find(project => project.Id === Number(this.selectedProcess.get("projectId")))
        this.selectedProject = observable.map(selectedProject)
        
        const workNotes = await this.dataService.fetchWorkNotes(this.selectedWork.get("Id") as number)
        const projectNotes = await this.dataService.fetchProjectNotes(this.selectedProject.get("Id") as number)
        runInAction(() => {
            this.selectedWorkNotes = workNotes
            this.selectedProjectNotes = projectNotes
        })
    }

    @action
    updateSelectedProcess(fieldName: string, newVal: FormEntryType): void {
        this.selectedProcess.set(fieldName, String(newVal))
    }

    @action
    async submitSelectedProcess(): Promise<void> {
        this.setAsyncPendingLockout(true)

        try {
            await this.dataService.updateRequestElement(toJS(this.selectedProcess) as any, ListName.PROCESSES)
        } catch(error) {
            console.log(error)
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @computed get canSubmitSelectedProcess(): boolean {
        return !this.asyncPendingLockout && isObjectEmpty(this.selectedProcessValidation)
    }

    // TODO, this validation recomputes all fields each time, very inefficient
    // returns plain javascript object mapping field names to error strings
    @computed
    get selectedProcessValidation(): {} {
        return this.selectedProcessFormControls.reduce((accumulator: {}, formControl: IFormControl) => {
            const fieldName: string = formControl.dataRef
            const inputVal = this.selectedProcess.get(fieldName)
            const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
            accumulator[fieldName] = error
            return accumulator
        }, {})
    }

    // computes a plain JavaScript object mapping step names process counts
    @computed
    get processCountsByStep(): { [stepName: string]: number } {
        return this.processes.reduce((accumulator: any, process) => {
            const stepName: string = process.step as string
            accumulator[stepName] !== undefined ? accumulator[stepName]++ : (accumulator[stepName] = 1)
            return accumulator
        }, {})
    }

    @computed
    private get selectedStepProcesses(): Array<ICloRequestElement> {
        return this.processes.filter(process => process.step === this.selectedStep.name)
    }

    @computed
    get selectedProcessFormControls(): Array<IFormControl> {
        return getView(this.selectedStep.view).formControls
    }

    // TODO make more efficient - cache requestElements by ID for quicker lookup?
    @computed
    get selectedStepProcessBriefs(): Array<IItemBrief> {
        return this.selectedStepProcesses.map(process => {
            const processWork = this.works.find(work => work.Id === Number(process.workId))
            const processProject = this.projects.find(project => project.Id === Number(process.projectId))
            return {
                header: `${processProject.department} ${processWork.type} Process`,
                subheader: `submitted to ${process.step} on ${process.dateSubmittedToCurrentStep}`,
                body: `${processWork.Title} - ${processWork.authorName || processWork.artist || processWork.composer}`,
                id: process.Id as number,
            }
        })
    }


    /*******************************************************************************************************/
    // VIEWS
    // the view heirarchy refers to nested pages an employee has visited within the page heirarchy
    // the first view in the array is the "home" page, the last view in the array is the currently viewed page
    // The hierarchy is as follows:
    //      Dashboard -> ProcessDetail -> WorkDetail | ProjectDetail
    @observable viewHierarchy: Array<EmployeeViewKey> = [EmployeeViewKey.Dashboard]

    @computed
    get currentView(): EmployeeViewKey {
        return this.viewHierarchy[this.viewHierarchy.length - 1]
    }

    @action
    reduceViewHierarchy(viewKeyString: string) {
        this.viewHierarchy = this.viewHierarchy.slice(0, this.viewHierarchy.indexOf(viewKeyString as EmployeeViewKey) + 1)
    }

    @action
    extendViewHierarchy(viewKey: EmployeeViewKey) {
        this.viewHierarchy.push(viewKey)
    }

    @computed
    get breadcrumbItems(): Array<IBreadcrumbItem> {
        return this.viewHierarchy.map(viewKey => {
            let text: string
            if (viewKey === EmployeeViewKey.Dashboard) text = `${this.root.sessionStore.currentUser.role.name || ""} Dashboard`
            else if (viewKey === EmployeeViewKey.ProcessDetail)
                text = `${this.selectedProcess.get("type") || ""} Process ${this.selectedProcess.get("Dd") || ""} Detail`
            else if (viewKey === EmployeeViewKey.ProjectDetail)
                text = `${this.selectedProject.get("type") || ""} Project ${this.selectedProject.get("Dd") || ""} Detail`
            else if (viewKey === EmployeeViewKey.WorkDetail)
                text = `${this.selectedWork.get("type") || ""} Work ${this.selectedWork.get("Dd") || ""} Detail`

            return {
                text,
                key: viewKey,
                onClick: () => this.reduceViewHierarchy(viewKey),
                isCurrentItem: viewKey === this.currentView,
            }
        })
    }
}

export enum EmployeeViewKey {
    Dashboard = "DASHBOARD",
    ProcessDetail = "PROCESS_DETAIL",
    ProjectDetail = "PROJECT_DETAIL",
    WorkDetail = "WORK_DETAIL",
}
