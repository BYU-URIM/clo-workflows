import { RootStore } from "./RootStore"
import { action, ObservableMap, observable, runInAction, computed, toJS, IKeyValueMap } from "mobx"
import { FormEntryType, CloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { IStep, StepName, getNextStepName } from "../model/Step"
import { IListItem } from "../component/NonScrollableList"
import { IBreadcrumbItem } from "office-ui-fabric-react/lib/Breadcrumb"
import { validateFormControl, isObjectEmpty, getFormattedDate } from "../utils"
import { INote, NoteSource, NoteScope } from "../model/Note"
import { IDataService, ListName } from "../service/dataService/IDataService"
import { getView, getStep, getViewAndMakeReadonly, getStepById } from "../model/loader/resourceLoaders"

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
    @observable canEditSelectedWork: boolean = false

    @computed get selectedWorkFormControls(): Array<IFormControl> {
        if(this.selectedWork.size !== 0) {
            return this.canEditSelectedWork
            ? getView(this.selectedWork.get("type") as string).formControls
            : getViewAndMakeReadonly(this.selectedWork.get("type") as string).formControls
        }
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

    @action toggleCanEditSelectedWork() {
        this.canEditSelectedWork = !this.canEditSelectedWork
    }


    /*******************************************************************************************************/
    // PROJECTS
    /*******************************************************************************************************/
    @observable projects: Array<CloRequestElement>
    @observable selectedProject: ObservableMap<FormEntryType>
    @observable canEditSelectedProject: boolean = false

    @computed
    get selectedProjectFormControls(): Array<IFormControl> {
        if(this.selectedProject.size !== 0) {
            return this.canEditSelectedProject
                ? getView(this.selectedProject.get("type") as string).formControls
                : getViewAndMakeReadonly(this.selectedProject.get("type") as string).formControls
        }
    }

    @action
    updateSelectedProject(fieldName: string, newVal: FormEntryType): void {
        this.selectedProject.set(fieldName, String(newVal))
    }

    @observable selectedProjectNotes: Array<INote> = []

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

    @action toggleCanEditSelectedProject() {
        this.canEditSelectedProject = !this.canEditSelectedProject
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
    @action async selectProcess(itemBrief: IListItem): Promise<void> {
        const selectedProcess: CloRequestElement = this.processes.find(process => process.Id === itemBrief.id)
        this.selectedProcess = observable.map(selectedProcess)
        this.extendViewHierarchy(EmployeeViewKey.ProcessDetail)

        const selectedWork = this.works.find(work => work.Id === Number(this.selectedProcess.get("workId")))
        this.selectedWork = observable.map(selectedWork)

        const selectedProject = this.projects.find(project => project.Id === Number(this.selectedProcess.get("projectId")))
        this.selectedProject = observable.map(selectedProject)
        
        const workNotes = await this.dataService.fetchNotes(
            NoteSource.WORK,
            NoteScope.EMPLOYEE,
            this.selectedWork.get("Id") as string,
            this.selectedProcess.get("submitterId") as string
        )
        const projectNotes = await this.dataService.fetchNotes(
            NoteSource.PROJECT,
            NoteScope.EMPLOYEE,
            this.selectedProject.get("Id") as string,
            this.selectedProcess.get("submitterId") as string
        )
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
            const currentStep = getStep(this.selectedProcess.get("step") as StepName)
            let updatedProcess = this.selectedProcess.toJS()
            updatedProcess = {...updatedProcess, ...{
                step: getNextStepName(updatedProcess),
                [currentStep.submissionDateDataRef]: getFormattedDate(),
                [currentStep.submitterIdDataRef]: this.root.sessionStore.currentUser.Id,
            }}
            await this.dataService.updateRequestElement(updatedProcess, ListName.PROCESSES)
            // replace cached process with successfully submitted selectedProcess
            this.replaceElementInListById(updatedProcess, this.processes)
            // clear out selectedProcess, selected project, and selected work
            this.clearSelectedRequestElements()
            this.reduceViewHierarchy(EmployeeViewKey.Dashboard)
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
    get selectedStepProcessBriefs(): Array<IListItem> {
        return this.selectedStepProcesses.map(process => {
            const processWork = this.works.find(work => work.Id === Number(process.workId))
            const processProject = this.projects.find(project => project.Id === Number(process.projectId))
            // to get the date when the process arrived at the current step for processing, look at the previous step submission date
            const currentStep = getStep(process.step as StepName)
            const previousStep = getStepById(currentStep.stepId-1)
            const submissionDateAtCurrentStep = currentStep && process[previousStep.submissionDateDataRef]
            return {
                header: `${processProject.department || ""} ${processWork.type || ""} Process`,
                subheader: `submitted to ${process.step} on ${submissionDateAtCurrentStep ? submissionDateAtCurrentStep : "an unknown date"}`,
                body: `${processWork.Title} - ${processWork.authorName || processWork.artist || processWork.composer}`,
                id: process.Id as number,
                selectable: true
            }
        })
    }


    /*******************************************************************************************************/
    // NOTES - SHARED BY RPOJECTS AND WORKS
    /*******************************************************************************************************/
    @action async submitNewNote(noteToCreate: INote, noteSource: NoteSource): Promise<boolean> {
        this.setAsyncPendingLockout(true)

        let submissionStatus = true
        try {
            // fill in any info the new note needs before submission
            noteToCreate.dateSubmitted = getFormattedDate()
            noteToCreate.submitter = this.root.sessionStore.currentUser.name
            if(noteToCreate.scope === NoteScope.CLIENT) {
                noteToCreate.attachedClientId = this.selectedProcess.get("submitterId") as string
            }

            if(noteSource === NoteSource.PROJECT) {
                noteToCreate.projectId = String(this.selectedProject.get("Id"))
            } else if(noteSource === NoteSource.WORK) {
                noteToCreate.workId = String(this.selectedWork.get("Id"))
            }

            const addResult = await this.dataService.createNote(noteToCreate)
            noteToCreate.Id = addResult.data.Id // assign the assigned SP ID to the newly created note
            
            // if submission is successful, add the new note to the corresponding list
            if(noteSource === NoteSource.WORK) runInAction(() => this.selectedWorkNotes.unshift(noteToCreate))
            if(noteSource === NoteSource.PROJECT) runInAction(() => this.selectedProjectNotes.unshift(noteToCreate))
            this.postMessage({messageText: "note successfully submitted", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({messageText: "there was a problem submitting your note, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }

        return submissionStatus
    }

    @action async updateNote(noteToUpdate: INote, noteSource: NoteSource): Promise<boolean> {
        this.setAsyncPendingLockout(true)
        let submissionStatus = true
        try {
            noteToUpdate.dateSubmitted = getFormattedDate()
            await this.dataService.updateNote(noteToUpdate)
            
            // if submission is successful, add the new note to the corresponding list
            if(noteSource === NoteSource.WORK) this.replaceElementInListById(noteToUpdate, this.selectedWorkNotes)
            if(noteSource === NoteSource.PROJECT) this.replaceElementInListById(noteToUpdate, this.selectedProjectNotes)

            this.postMessage({messageText: "note successfully updated", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({messageText: "there was a problem updating your note, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }

        return submissionStatus
    }

    @action async deleteNote(noteToDelete: INote, noteSource: NoteSource): Promise<boolean> {
        this.setAsyncPendingLockout(true)
        let submissionStatus = true

        try {
            await this.dataService.deleteNote(noteToDelete.Id)

            // if deletion is successful, remove the new note from the corresponding list
            if(noteSource === NoteSource.PROJECT) this.removeELementInListById(noteToDelete, this.selectedProjectNotes)
            if(noteSource === NoteSource.WORK) this.removeELementInListById(noteToDelete, this.selectedWorkNotes)
            this.postMessage({messageText: "note successfully deleted", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.postMessage({messageText: "there was a problem deleting your note, try again", messageType: "error"})
        } finally {
            this.setAsyncPendingLockout(false)
        }
        return submissionStatus
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
    private replaceElementInListById(newItem: CloRequestElement | INote, list: Array<CloRequestElement | INote>): boolean {
        const staleItemIndex = list.findIndex(listItem => listItem["Id"] === newItem["Id"])

        if(staleItemIndex !== -1) {
            list[staleItemIndex] = newItem
            return true
        }
        return false
    }

    @action
    private removeELementInListById(itemToDelete: CloRequestElement | INote, list: Array<CloRequestElement | INote>) {
        list.splice(list.findIndex(listItem => listItem["Id"] === listItem["Id"]), 1 /*remove 1 elem*/)
    }
}

export enum EmployeeViewKey {
    Dashboard = "DASHBOARD",
    ProcessDetail = "PROCESS_DETAIL"
}
