import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { IStep } from "../model/Step"
import { IItemBrief } from "../component/NonScrollableList"
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb"

// stores all in-progress projects, processes, and works that belong the current employee's steps
@autobind
export class EmployeeStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.projects = await this.dataService.fetchEmployeeActiveProjects()
        this.works = await this.dataService.fetchEmployeeActiveWorks()
        this.processes = await this.dataService.fetchEmployeeActiveProcesses()

        this.selectedProject = observable.map()
        this.selectedWork = observable.map()
        this.selectedProcess = observable.map()
    }


    /*******************************************************************************************************/
    // WORKS
    @observable works: Array<ICloRequestElement>
    @observable selectedWork: ObservableMap<FormEntryType>


    /*******************************************************************************************************/
    // PROJECTS
    @observable projects: Array<ICloRequestElement>
    @observable selectedProject: ObservableMap<FormEntryType>

    @computed get selectedProjectFormControls(): Array<IFormControl> {
        return this.dataService.getProjectFormControlsForType(this.selectedProject.get("type") as string)
    }

    @action updateSelectedProject(fieldName: string, newVal: FormEntryType): void {
        this.selectedProject.set(fieldName, newVal)
    }


    /*******************************************************************************************************/
    // STEPS
    @observable selectedStep: string
    @action selectStep(step: string): void {
        this.selectedStep = step
    }


    /*******************************************************************************************************/
    // PROCESSES
    @observable processes: Array<ICloRequestElement>
    @observable selectedProcess: ObservableMap<FormEntryType>

    // TODO project lookup should be more efficient, store as map ?
    @action selectProcess(itemBrief: IItemBrief): void {
        const selectedProcess: ICloRequestElement = this.processes.find(process => process.id === itemBrief.id)
        this.selectedProcess = observable.map(selectedProcess)
        this.extendViewHierarchy(EmployeeViewKey.ProcessDetail)
    }

    // computes a plain JavaScript object mapping step names process counts
    @computed get processCountsByStep(): {[stepName: string]: number} {
        return this.processes.reduce((accumulator: any, process) => {
            const stepName: string = process.step as string
            accumulator[stepName] !== undefined ? accumulator[stepName]++ : accumulator[stepName] = 1
            return accumulator
        }, {})
    }

    @computed private get processesForSelectedStep(): Array<ICloRequestElement> {
        return this.processes.filter(process => process.step === this.selectedStep)
    }
    // TODO make more efficient - cache requestElements by ID for quicker lookup?
    @computed get processBriefsForSelectedStep(): Array<IItemBrief> {
        return this.processesForSelectedStep.map(process => {
            const processWork = this.works.find(work => work.id === process.workId)
            const processProject = this.projects.find(project => project.id === process.projectId)
            return {
                header: `${processProject.department} ${processWork.type} Process`,
                subheader: `submitted to ${process.step} on ${process.dateSubmittedToCurrentStep}`,
                body: `${processWork.title} - ${processWork.author || processWork.artist || processWork.composer}`,
                id: process.id as number,
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

    @computed get currentView(): EmployeeViewKey {
        return this.viewHierarchy[this.viewHierarchy.length-1]
    }

    @action reduceViewHierarchy(viewKeyString: string) {
        this.viewHierarchy = this.viewHierarchy.slice(0, this.viewHierarchy.indexOf(viewKeyString as EmployeeViewKey) + 1)
    }

    @action extendViewHierarchy(viewKey: EmployeeViewKey) {
        this.viewHierarchy.push(viewKey)
    }

    @computed get breadcrumbItems(): Array<IBreadcrumbItem> {
        return this.viewHierarchy.map(viewKey => {
            let text: string
            if(viewKey === EmployeeViewKey.Dashboard) text = `${this.root.sessionStore.currentUser.role.name || ""} Dashboard`
            else if(viewKey === EmployeeViewKey.ProcessDetail) text = `${this.selectedProcess.get("type") || ""} Process ${this.selectedProcess.get("id") || ""}`
            else if(viewKey === EmployeeViewKey.ProjectDetail) text = `${this.selectedProject.get("type") || ""} Project ${this.selectedProject.get("id") || ""}`
            else if(viewKey === EmployeeViewKey.WorkDetail) text = `${this.selectedWork.get("type") || ""} Work ${this.selectedWork.get("id") || ""}`

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
