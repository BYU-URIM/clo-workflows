import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { IStep } from "../model/Step"
import { IItemBrief } from "../component/NonScrollableList"
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb"
import { validateFormControl } from "../utils"

// stores all in-progress projects, processes, and works that belong the current employee's steps
@autobind
export class EmployeeStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        const currentUser = this.root.sessionStore.currentUser
        this.projects = await this.dataService.fetchEmployeeActiveProjects(currentUser)
        this.works = await this.dataService.fetchEmployeeActiveWorks(currentUser)
        this.processes = await this.dataService.fetchEmployeeActiveProcesses(currentUser)

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
        return this.dataService.getView(this.selectedProject.get("type") as string).formControls
    }

    @action updateSelectedProject(fieldName: string, newVal: FormEntryType): void {
        this.selectedProject.set(fieldName, newVal)
    }


    /*******************************************************************************************************/
    // STEPS
    @observable selectedStep: IStep
    @action selectStep(step: IStep): void {
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

    @action updateSelectedProcess(fieldName: string, newVal: FormEntryType): void {
        this.selectedProcess.set(fieldName, newVal)
    }

    // TODO, this validation recomputes all fields each time, very inefficient
    // returns plain javascript object mapping field names to error strings
    @computed get selectedProcessValidation(): {} {
        return this.selectedProcessFormControls.reduce((accumulator: {}, formControl: IFormControl) => {
            const fieldName: string = formControl.dataRef
            const inputVal = this.selectedProcess.get(fieldName)
            const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
            accumulator[fieldName] = error
            return accumulator
        }, {})
    }

    // computes a plain JavaScript object mapping step names process counts
    @computed get processCountsByStep(): {[stepName: string]: number} {
        return this.processes.reduce((accumulator: any, process) => {
            const stepName: string = process.step as string
            accumulator[stepName] !== undefined ? accumulator[stepName]++ : accumulator[stepName] = 1
            return accumulator
        }, {})
    }

    @computed private get selectedStepProcesses(): Array<ICloRequestElement> {
        return this.processes.filter(process => process.step === this.selectedStep.name)
    }

    @computed get selectedProcessFormControls(): Array<IFormControl> {
        return this.dataService.getView(this.selectedStep.view).formControls
    }

    // TODO make more efficient - cache requestElements by ID for quicker lookup?
    @computed get selectedStepProcessBriefs(): Array<IItemBrief> {
        return this.selectedStepProcesses.map(process => {
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

    @observable selectedProcessNotes: Array<IItemBrief> = [
        {header: "1/1/2015", body: "Sed ut perspiciatis unde omnis iste natus error sit", id: 1},
        {header: "1/1/2013", body: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis", id: 2},
        {header: "1/1/2010", body: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis", id: 2},
    ]


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
            else if(viewKey === EmployeeViewKey.ProcessDetail) text = `${this.selectedProcess.get("type") || ""} Process ${this.selectedProcess.get("id") || ""} Detail`
            else if(viewKey === EmployeeViewKey.ProjectDetail) text = `${this.selectedProject.get("type") || ""} Project ${this.selectedProject.get("id") || ""} Detail`
            else if(viewKey === EmployeeViewKey.WorkDetail) text = `${this.selectedWork.get("type") || ""} Work ${this.selectedWork.get("id") || ""} Detail`

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
