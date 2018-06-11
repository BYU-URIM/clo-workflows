import { RootStore } from "../"
import { action, ObservableMap, observable, runInAction, computed, reaction } from "mobx"
import { CloRequestElement } from "../../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IStep, StepName } from "../../model/Step"
import { IListItem } from "../../components/NonScrollableList/NonScrollableList"
import { IBreadcrumbItem } from "office-ui-fabric-react"
import { IDataService, ListName } from "../../service/dataService/IDataService"
import { getStep, getStepById } from "../../model/loader/resourceLoaders"
import { StoreUtils } from "./.."
import { RequestDetailStore } from "./RequestDetailStore"
import { IMessage, IViewProvider } from "../ViewProvider"

// stores all in-progress projects, processes, and works that belong the current employee's steps
@autobind
export class EmployeeStore implements IViewProvider {
    constructor(public readonly root: RootStore, private readonly dataService: IDataService) {}

    @action
    async init(): Promise<void> {
        // fetch request elements
        const currentUser = this.root.sessionStore.currentUser
        const activeProcessList = await this.dataService.fetchEmployeeActiveProcesses(currentUser)
        runInAction(() => (this.activeProcesses = StoreUtils.mapRequestElementArrayById(activeProcessList)))

        const activeProjectList = await this.dataService.fetchRequestElementsById(
            activeProcessList.map(process => Number(process.projectId)),
            ListName.PROJECTS
        )
        runInAction(() => (this.activeProjects = StoreUtils.mapRequestElementArrayById(activeProjectList)))

        const activeWorkList = await this.dataService.fetchRequestElementsById(
            activeProcessList.map(process => Number(process.workId)),
            ListName.WORKS
        )
        runInAction(() => (this.activeWorks = StoreUtils.mapRequestElementArrayById(activeWorkList)))

        this.setAsyncPendingLockout(false)

        /**
         * MOBX REACTIONS
         * first param returns data to react to, second param is reactive function to run
         * if the view heirarchy does not contain request detail, the requestDetailStore can be disposed
         * by reactively disposing of the request detail store,
         * the store creation / disposal logic is decoupled from view logic
         */
        reaction(
            () => this.canDisposeRequestDetailStore,
            () => this.canDisposeRequestDetailStore && this.disposeRequestDetailStore()
        )

        /**
         * if the user has focused on a step, automatically clear out searched requests
         * so that step-specific requests can be displayed
         */
        reaction(
            () => this.isFocusStep,
            () => this.isFocusStep && this.unfocusSearch()
        )

        /* if the user has executed a search for past processes,
        automatically clear out step requests so that searched requests can be displayed */
        reaction(
            () => this.isFocusSearch,
            () => this.isFocusSearch && this.unfocusStep()
        )
    }

    @observable requestDetailStore: RequestDetailStore
    // runs automatically when current view is set to dashboard - see reactions in init()
    @action
    private disposeRequestDetailStore() {
        this.requestDetailStore = null
    }
    @computed
    get canDisposeRequestDetailStore(): boolean {
        return !this.viewHierarchy.includes(EmployeeViewKey.ProcessDetail)
    }

    /*******************************************************************************************************/
    // WORKS
    @observable activeWorks: ObservableMap<CloRequestElement>
    @observable searchedWorks: ObservableMap<CloRequestElement>

    /*******************************************************************************************************/
    // PROJECTS
    @observable activeProjects: ObservableMap<CloRequestElement>
    @observable searchedProjects: ObservableMap<CloRequestElement>

    /*******************************************************************************************************/
    // STEPS
    @observable focusStep: IStep
    @action
    selectFocusStep(step: IStep): void {
        this.focusStep = step
    }
    @computed
    get isFocusStep(): boolean {
        return !!this.focusStep
    }
    @action
    private unfocusStep(): void {
        this.focusStep = null
    }

    /*******************************************************************************************************/
    // PROCESSES
    @observable activeProcesses: ObservableMap<CloRequestElement>
    @observable searchedProcesses: ObservableMap<CloRequestElement>

    // TODO project lookup should be more efficient, store as map ?
    @action
    async selectActiveDetailProcess(itemBrief: IListItem): Promise<void> {
        return this.selectDetailProcess(itemBrief, this.activeProcesses, this.activeWorks, this.activeProjects)
    }

    // computes a plain JavaScript object mapping step names process counts
    @computed
    get processCountsByStep(): { [stepName: string]: number } {
        return this.activeProcesses.values().reduce((accumulator: any, process) => {
            const stepName: string = process.step as string
            accumulator[stepName] !== undefined ? accumulator[stepName]++ : (accumulator[stepName] = 1)
            return accumulator
        }, {})
    }

    @computed
    private get selectedStepProcesses(): ObservableMap<CloRequestElement> {
        if (this.focusStep) {
            const filteredProcesses = this.activeProcesses
                .values()
                .filter(process => process.step === this.focusStep.name)
            return StoreUtils.mapRequestElementArrayById(filteredProcesses)
        }
    }

    @computed
    get selectedStepProcessBriefs(): Array<IListItem> {
        return EmployeeStore.getProcessBriefsFromRequestElements(
            this.selectedStepProcesses,
            this.activeWorks,
            this.activeProjects
        )
    }

    // searches past processes by title - populates searchedWorks, searchedProcesses, and searchedProject arrays
    @action
    async searchProcesses(searchTerm: string) {
        const processes = await this.dataService.searchProcessesByTitle(searchTerm)
        const works = await this.dataService.fetchRequestElementsById(
            processes.map(proc => Number(proc.workId)),
            ListName.WORKS
        )
        const projects = await this.dataService.fetchRequestElementsById(
            processes.map(proc => Number(proc.projectId)),
            ListName.PROJECTS
        )
        runInAction(() => {
            this.searchedProcesses = StoreUtils.mapRequestElementArrayById(processes)
            this.searchedWorks = StoreUtils.mapRequestElementArrayById(works)
            this.searchedProjects = StoreUtils.mapRequestElementArrayById(projects)
        })
    }
    @action
    private unfocusSearch(): void {
        this.searchedProcesses = null
        this.searchedProjects = null
        this.searchedWorks = null
    }
    @computed
    get isFocusSearch(): boolean {
        return !!(this.searchedProcesses && this.searchedProjects && this.searchedWorks)
    }
    @computed
    get searchedProcessBriefs(): Array<IListItem> {
        // request briefs are small summaries of a request that contain information about the work, process, and project
        return EmployeeStore.getProcessBriefsFromRequestElements(
            this.searchedProcesses,
            this.searchedWorks,
            this.searchedProjects
        )
    }
    @action
    async selectSearchedDetailProcess(itemBrief: IListItem): Promise<void> {
        return this.selectDetailProcess(itemBrief, this.searchedProcesses, this.searchedWorks, this.searchedProjects)
    }

    @action
    private async selectDetailProcess(
        selectedProcessBrief: IListItem,
        processesMap: ObservableMap<CloRequestElement>,
        worksMap: ObservableMap<CloRequestElement>,
        projectsMap: ObservableMap<CloRequestElement>
    ): Promise<void> {
        const selectedProcess: CloRequestElement = processesMap.get(String(selectedProcessBrief.id))
        const selectedWork = worksMap.get(selectedProcess.workId as string)
        const selectedProject = projectsMap.get(selectedProcess.projectId as string)
        this.requestDetailStore = new RequestDetailStore(
            this,
            this.dataService,
            selectedProcess,
            selectedProject,
            selectedWork
        )
        this.extendViewHierarchy(EmployeeViewKey.ProcessDetail)
        await this.requestDetailStore.init()
    }

    private static getProcessBriefsFromRequestElements(
        processesMap: ObservableMap<CloRequestElement>,
        worksMap: ObservableMap<CloRequestElement>,
        projectsMap: ObservableMap<CloRequestElement>
    ): Array<IListItem> {
        if (processesMap && worksMap && projectsMap) {
            return processesMap.values().map(process => {
                const processWork = worksMap.get(process.workId as string)
                const processProject = projectsMap.get(process.projectId as string)
                /* to get the date when the process arrived at the current step for processing,
                look at the previous step submission date */
                const currentStep = getStep(process.step as StepName)
                const previousStep = getStepById(currentStep.orderId - 1)
                const submissionDateAtCurrentStep = currentStep && process[previousStep.submissionDateFieldName]
                return {
                    header: `${processProject.Title || ""} - ${processWork.type || ""} Process`,
                    subheader: `submitted to ${process.step} on ${
                        submissionDateAtCurrentStep ? submissionDateAtCurrentStep : "an unknown date"
                    }`,
                    body: `${processWork.Title} - ${processWork.authorName ||
                        processWork.artist ||
                        processWork.composer ||
                        "unknown artist"}`,
                    id: process.Id as number,
                    selectable: true,
                }
            })
        }
    }

    /*******************************************************************************************************/
    // VIEW STATE

    // the view heirarchy refers to nested pages an employee has visited within the page heirarchy
    // the first view in the array is the "home" page, the last view in the array is the currently viewed page
    // The hierarchy is as follows:
    //      Dashboard -> ProcessDetail
    @observable viewHierarchy: Array<EmployeeViewKey> = [EmployeeViewKey.Dashboard]

    @computed
    get currentView(): EmployeeViewKey {
        return this.viewHierarchy[this.viewHierarchy.length - 1]
    }

    @action
    reduceViewHierarchy(viewKeyString: string) {
        this.viewHierarchy = this.viewHierarchy.slice(
            0,
            this.viewHierarchy.indexOf(viewKeyString as EmployeeViewKey) + 1
        )
    }

    @action
    extendViewHierarchy(viewKey: EmployeeViewKey) {
        this.viewHierarchy.push(viewKey)
    }

    @computed
    get breadcrumbItems(): Array<IBreadcrumbItem> {
        return this.viewHierarchy.map(viewKey => {
            let text: string
            if (viewKey === EmployeeViewKey.Dashboard) text = "Processor Dashboard"
            else if (viewKey === EmployeeViewKey.ProcessDetail)
                text = `${this.requestDetailStore.process.get("type") ||
                    ""} Process ${this.requestDetailStore.process.get("Id") || ""} Detail`

            return {
                text,
                key: viewKey,
                onClick: () => this.reduceViewHierarchy(viewKey),
                isCurrentItem: viewKey === this.currentView,
            }
        })
    }

    @observable asyncPendingLockout: boolean
    @action
    setAsyncPendingLockout(val: boolean) {
        this.asyncPendingLockout = val
    }

    @observable message: IMessage
    @action
    postMessage(message: IMessage, displayTime: number = 5000) {
        this.message = message
        setTimeout(
            action(() => {
                this.message = null
            }),
            displayTime
        )
    }

    @observable clientMode: boolean = false
    @action
    toggleClientMode() {
        this.clientMode = !this.clientMode
        if (this.clientMode) {
            this.root.clientStore.data.init()
            this.root.clientStore.view.resetClientState()
        } else {
            this.init()
        }
    }
}

export enum EmployeeViewKey {
    Dashboard = "DASHBOARD",
    ProcessDetail = "PROCESS_DETAIL",
}
