import { RootStore } from "./RootStore"
import { action, ObservableMap, observable, runInAction, computed, toJS, IKeyValueMap } from "mobx"
import { FormEntryType, CloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { IStep, StepName, getNextStepName } from "../model/Step"
import { IItemBrief } from "../component/NonScrollableList"
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb"
import { validateFormControl, isObjectEmpty, getFormattedDate } from "../utils"
import { INote } from "../model/Note"
import { IDataService, ListName } from "../service/dataService/IDataService"
import { getView, getStep } from "../model/loader/resourceLoaders"

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

        this.setAsyncPendingLockout(false)
    }


    /*******************************************************************************************************/
    // WORKS
    /*******************************************************************************************************/
    @observable works: Array<CloRequestElement>
    @observable selectedWork: ObservableMap<FormEntryType>

    @computed get selectedWorkFormControls(): Array<IFormControl> {
        return getView(this.selectedWork.get("type") as string).formControls
    }

    @action updateSelectedWork(fieldName: string, newVal: FormEntryType): void {
        this.selectedWork.set(fieldName, String(newVal))
    }

    @observable selectedWorkNotes: Array<INote> = []

    @action
    async submitSelectedWork(): Promise<void> {
        this.setAsyncPendingLockout(true)

        try {
            const updatedWork = this.selectedWork.toJS()
            await this.dataService.updateRequestElement(updatedWork, ListName.WORKS)
            this.replaceElementInListById(updatedWork, this.works)
            this.postMessage({messageText: "work successfully submitted", messageType: "success"})
        } catch(error) {
            console.log(error)
            this.postMessage({messageText: "there was a problem submitting your work, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitSelectedWork(): boolean {
        return !this.asyncPendingLockout
    }

    @observable workNoteEntry: string

    @action updateWorkNoteEntry(newVal: string) {
        this.workNoteEntry = newVal
    }

    @action async submitWorkNoteEntry(): Promise<boolean> {
        this.setAsyncPendingLockout(true)

        let submissionStatus = true
        try {
            const newNote = {
                submitter: this.root.sessionStore.currentUser.name,
                dateSubmitted: getFormattedDate(),
                text: this.workNoteEntry,
                workId: String(this.selectedWork.get("Id"))
            }
            await this.dataService.createNote(newNote, ListName.NOTES)
            
            // if submission is successful, clear the work note entry and add it to project notes
            this.updateWorkNoteEntry("")
            runInAction(() => this.selectedWorkNotes.unshift(newNote))
            this.postMessage({messageText: "successfully submitted note", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({messageText: "there was a problem submitting your note, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }

        return submissionStatus
    }


    /*******************************************************************************************************/
    // PROJECTS
    /*******************************************************************************************************/
    @observable projects: Array<CloRequestElement>
    @observable selectedProject: ObservableMap<FormEntryType>

    @computed
    get selectedProjectFormControls(): Array<IFormControl> {
        return getView(this.selectedProject.get("type") as string).formControls
    }

    @action
    updateSelectedProject(fieldName: string, newVal: FormEntryType): void {
        this.selectedProject.set(fieldName, String(newVal))
    }

    @observable selectedProjectNotes: Array<INote>

    @action
    async submitSelectedProject(): Promise<void> {
        this.setAsyncPendingLockout(true)

        try {
            const updatedProject = this.selectedProject.toJS()
            await this.dataService.updateRequestElement(updatedProject, ListName.PROJECTS)
            this.replaceElementInListById(updatedProject, this.projects)
            this.postMessage({messageText: "project successfully submitted", messageType: "success"})
        } catch(error) {
            console.log(error)
            this.postMessage({messageText: "there was a problem submitting your project, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitSelectedProject(): boolean {
        return !this.asyncPendingLockout
    }

    @observable projectNoteEntry: string

    @action updateProjectNoteEntry(newVal: string) {
        this.projectNoteEntry = newVal
    }

    @action async submitProjectNoteEntry(): Promise<boolean> {
        this.setAsyncPendingLockout(true)

        let submissionStatus = true
        try {
            const newNote = {
                submitter: this.root.sessionStore.currentUser.name,
                dateSubmitted: getFormattedDate(),
                text: this.projectNoteEntry,
                projectId: String(this.selectedProject.get("Id"))
            }
            await this.dataService.createNote(newNote, ListName.NOTES)
            
            // if submission is successful, clear the project note entry and add it to project notes
            this.updateProjectNoteEntry("")
            runInAction(() => this.selectedProjectNotes.unshift(newNote))
            this.postMessage({messageText: "note successfully submitted", messageType: "error"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({messageText: "there was a problem submitting your note, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }

        return submissionStatus
    }


    /*******************************************************************************************************/
    // STEPS
    /*******************************************************************************************************/
    @observable selectedStep: IStep
    @action
    selectStep(step: IStep): void {
        this.selectedStep = step
    }


    /*******************************************************************************************************/
    // PROCESSES
    /*******************************************************************************************************/
    @observable processes: Array<CloRequestElement>
    @observable selectedProcess: ObservableMap<FormEntryType>

    // TODO project lookup should be more efficient, store as map ?
    @action async selectProcess(itemBrief: IItemBrief): Promise<void> {
        const selectedProcess: CloRequestElement = this.processes.find(process => process.Id === itemBrief.id)
        this.selectedProcess = observable.map(selectedProcess)
        this.extendViewHierarchy(EmployeeViewKey.ProcessDetail)

        const selectedWork = this.works.find(work => work.Id === Number(this.selectedProcess.get("workId")))
        this.selectedWork = observable.map(selectedWork)

        const selectedProject = this.projects.find(project => project.Id === Number(this.selectedProcess.get("projectId")))
        this.selectedProject = observable.map(selectedProject)
        
        const workNotes = await this.dataService.fetchWorkNotes(this.selectedWork.get("Id") as string)
        const projectNotes = await this.dataService.fetchProjectNotes(this.selectedProject.get("Id") as string)
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
            const updatedProcess = this.selectedProcess.toJS()
            await this.dataService.updateRequestElement(updatedProcess, ListName.PROCESSES)
            // replace cached process with successfully submitted selectedProcess
            this.replaceElementInListById(updatedProcess, this.processes)
            // clear out selectedProcess, selected project, and selected work
            this.clearSelectedRequestElements()
            this.postMessage({messageText: "process successfully submitted", messageType: "success"})

        } catch(error) {
            console.log(error)
            this.postMessage({messageText: "there was a problem submitting your process, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }
    }

    @action async submitSelectedProcessToNextStep() {
        this.setAsyncPendingLockout(true)

        const curProcess: CloRequestElement = this.selectedProcess.toJS()
        const nextStepName: StepName = getNextStepName(curProcess)
        const nextStep: IStep = getStep(nextStepName)
        const nextStepProcess = {...curProcess, ...{
            step: nextStepName,
            [nextStep.submitterIdDataRef]: this.root.sessionStore.currentUser.Id,
            [nextStep.submissionDateDataRef]: getFormattedDate()
        }}

        try {
            await this.dataService.updateRequestElement(nextStepProcess, ListName.PROCESSES)

            // replace cached process with successfully submitted nextProcess
            this.replaceElementInListById(nextStepProcess, this.processes)

            // clear out selectedProcess, selectedWork, and selected project
            this.clearSelectedRequestElements()
            
            // return user back to dashboard by "popping off" the current view from the view heirarchy stack
            this.reduceViewHierarchy(EmployeeViewKey.Dashboard)

            this.postMessage({messageText: "process successfully submitted", messageType: "success"})

        } catch(error) {
            console.log(error)
            this.postMessage({messageText: "there was a problem submitting your process, try again", messageType: "error"})
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
    private get selectedStepProcesses(): Array<CloRequestElement> {
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
    //      Dashboard -> ProcessDetail
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
            if (viewKey === EmployeeViewKey.Dashboard)
                text =  "Processor Dashboard"
            else if (viewKey === EmployeeViewKey.ProcessDetail)
                text = `${this.selectedProcess.get("type") || ""} Process ${this.selectedProcess.get("Id") || ""} Detail`

            return {
                text,
                key: viewKey,
                onClick: () => this.reduceViewHierarchy(viewKey),
                isCurrentItem: viewKey === this.currentView,
            }
        })
    }


    /*******************************************************************************************************/
    // MISCELLANEOUS MEMBERS AND HELPER METHODS
    /*******************************************************************************************************/
    @observable asyncPendingLockout: boolean
    @action setAsyncPendingLockout(val: boolean) {
        this.asyncPendingLockout = val
    }

    @observable message: any
    @action postMessage(message: any, displayTime: number = 5000) {
        this.message = message
        setTimeout(action(() => {
            this.message = null
        }), displayTime)
    }

    @action
    private clearSelectedRequestElements(): void {
        this.selectedProcess.clear()
        this.selectedProject.clear()
        this.selectedWork.clear()
    }

    // finds the item with the with the same ID as the new item and replaces the stale item with the new item
    // true if replacement was successfull, false if not (stale list item was not found) 
    @action
    private replaceElementInListById(newItem: CloRequestElement, list: Array<any>): boolean {
        const staleItemIndex = list.findIndex(listItem => listItem.Id === newItem.Id)

        if(staleItemIndex !== -1) {
            list[staleItemIndex] = newItem
            return true
        }
        return false
    }
}

export enum EmployeeViewKey {
    Dashboard = "DASHBOARD",
    ProcessDetail = "PROCESS_DETAIL"
}
