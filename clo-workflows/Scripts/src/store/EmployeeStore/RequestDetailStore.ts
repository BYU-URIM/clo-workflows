import { observable, computed, action, runInAction, ObservableMap, reaction } from "mobx"
import { IDataService, ListName } from "../../service/"
// import { autobind } from "core-decorators"
import Utils from "../../utils"
import { StoreUtils, NotesStore, EmployeeStore, EmployeeViewKey } from "../"
import {
    FormEntryType,
    CloRequestElement,
    NoteSource,
    NoteScope,
    StepName,
    getNextStepName,
    getView,
    getViewAndMakeReadonly,
    getStepForProcessFieldName,
    getStep,
    View,
    IFormControl,
} from "../../model"


export class RequestDetailStore {
    constructor(
        public readonly employeeStore: EmployeeStore,
        private readonly dataService: IDataService,
        private originalProcess: CloRequestElement,
        private originalProject: CloRequestElement,
        private originalWork: CloRequestElement
    ) {
        this.process = observable.map(originalProcess)
        this.project = observable.map(originalProject)
        this.work = observable.map(originalWork)
        this.use = observable.map(originalProcess)

        // if process is changed, recalculate next step
        reaction(() => this.process.values(), () => (this.nextStepName = getNextStepName(this.process.toJS())))
    }

    @observable workNotesStore: NotesStore
    @observable projectNotesStore: NotesStore

    @action
    init = async (): Promise<void> => {
        const workNotes = await this.dataService.fetchNotes(
            NoteSource.WORK,
            NoteScope.EMPLOYEE,
            this.work.get("Id") as string,
            this.process.get("submitterId") as string
        )
        const projectNotes = await this.dataService.fetchNotes(
            NoteSource.PROJECT,
            NoteScope.EMPLOYEE,
            this.project.get("Id") as string,
            this.process.get("submitterId") as string
        )
        runInAction(() => {
            this.workNotesStore = new NotesStore({
                viewProvider: this.employeeStore,
                dataService: this.dataService,
                source: NoteSource.WORK,
                maxScope: NoteScope.EMPLOYEE,
                notes: workNotes,
                attachedClientId: this.process.get("submitterId") as string,
                attachedWorkId: this.work.get("Id") as number,
            })
            this.projectNotesStore = new NotesStore({
                viewProvider: this.employeeStore,
                dataService: this.dataService,
                source: NoteSource.PROJECT,
                maxScope: NoteScope.EMPLOYEE,
                notes: projectNotes,
                attachedClientId: this.process.get("submitterId") as string,
                attachedProjectId: this.project.get("Id") as number,
            })
        })
    }

    @computed
    get isRequestActive(): boolean {
        return (this.process.get("step") as StepName) !== "Complete" && (this.process.get("step") as StepName) !== "Canceled"
    }
    /*******************************************************************************************************/
    // USE
    /*******************************************************************************************************/
    @observable use: ObservableMap<FormEntryType>
    @observable canEditUse: boolean = false
    @computed
    get useView(): View {
        console.log("here")
        console.log(this.work)
        
        
        const curUserRole = this.employeeStore.root.sessionStore.currentUser.primaryRole
        return this.canEditUse
            ? getView(this.work.get("type") as string, curUserRole)
            : getViewAndMakeReadonly(this.work.get("type") as string, curUserRole)
    }
    @computed
    get canSubmitUse(): boolean {
        return !this.employeeStore.asyncPendingLockout && Utils.isObjectEmpty(this.useValidation) && this.isRequestActive
    }

    @computed
    get useValidation(): {} {
        return StoreUtils.validateFormControlGroup(this.useView.useFields, this.use)
    }

    @action
    updateUse = (fieldName: string, newVal: FormEntryType): void => {
        this.use.set(fieldName, String(newVal))
    }

    @action
    submitUse = async (): Promise<void> => {
        this.useView.touchAllRequiredformFields()
        if (!this.canSubmitUse) {
            this.employeeStore.postMessage({ messageText: "please fix all form errors", messageType: "error" })
            return
        }

        try {
            this.employeeStore.setAsyncPendingLockout(true)
            const updatedUse = this.use.toJS() as CloRequestElement

            await this.dataService.updateRequestElement(updatedUse, ListName.PROCESSES)
            // replace cached process with successfully submitted process
            this.employeeStore.activeProcesses.set(String(updatedUse.Id), updatedUse)
            this.employeeStore.postMessage({ messageText: "process successfully submitted", messageType: "success" })
        } catch (error) {
            console.log(error)
            this.employeeStore.postMessage({
                messageText: "there was a problem submitting your process, try again",
                messageType: "error",
            })
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }
    @action
    startEditingUse = () => {
        this.canEditUse = true
    }
    @action
    stopEditingUse = () => {
        this.canEditUse = false
        this.resetUseToOriginal()
    }
    @action
    private resetUseToOriginal = () => {
        this.use = observable.map(this.originalProcess)
    }

    /*******************************************************************************************************/
    // PROCESSES
    /*******************************************************************************************************/
    @observable process: ObservableMap<FormEntryType>
    @observable nextStepName: StepName
    @observable canEditProcess: boolean = false

    @action
    updateNextStepName = (stepName: StepName) => {
        this.nextStepName = stepName
    }

    @computed
    get processView(): View {
        const curUserRole = this.employeeStore.root.sessionStore.currentUser.primaryRole
        if (this.isRequestActive && this.employeeStore.focusStep) return getView(this.employeeStore.focusStep.view, curUserRole)
        else return getView("Complete", curUserRole)
    }

    getProcessSubmissionMetadata = (formControl: IFormControl): string => {
        // if the form control is readonly - look up the submission metadata to display under the form control
        // if the form control is not readonly, it is active and the present submission will overwrite the metadata
        if (formControl.readonly) {
            const parentStep = getStepForProcessFieldName(formControl.dataRef)
            const submitter = this.process.get(parentStep.submitterFieldName)
            const submissionDate = this.process.get(parentStep.submissionDateFieldName)
            if (submitter && submissionDate) {
                return `submitted by ${submitter} on ${submissionDate}`
            } else {
                return "skipped"
            }
        }
    }

    @computed
    get canSubmitProcess(): boolean {
        return !this.employeeStore.asyncPendingLockout && Utils.isObjectEmpty(this.processValidation) && this.isRequestActive && !!this.nextStepName
    }

    @computed
    get processValidation(): {} {
        return StoreUtils.validateFormControlGroup(this.processView.formFields, this.process)
    }

    @action
    updateProcess = (fieldName: string, newVal: FormEntryType): void => {
        this.process.set(fieldName, String(newVal))
    }

    @action
    submitProcess = async (): Promise<void> => {
        this.processView.touchAllRequiredformFields()
        if (!this.canSubmitProcess) {
            this.employeeStore.postMessage({ messageText: "please fix all form errors", messageType: "error" })
            return
        }

        try {
            this.employeeStore.setAsyncPendingLockout(true)
            const currentStep = getStep(this.process.get("step") as StepName)
            let updatedProcess = this.process.toJS() as CloRequestElement
            updatedProcess = {
                ...updatedProcess,
                ...{
                    step: this.nextStepName,
                    [currentStep.submissionDateFieldName]: Utils.getFormattedDate(),
                    [currentStep.submitterFieldName]: this.employeeStore.root.sessionStore.currentUser.name,
                },
            }
            await this.dataService.updateRequestElement(updatedProcess, ListName.PROCESSES)
            // replace cached process with successfully submitted process
            this.employeeStore.activeProcesses.set(String(updatedProcess.Id), updatedProcess)

            this.employeeStore.reduceViewHierarchy(EmployeeViewKey.Dashboard)
            this.employeeStore.postMessage({ messageText: "process successfully submitted", messageType: "success" })
        } catch (error) {
            console.log(error)
            this.employeeStore.postMessage({
                messageText: "there was a problem submitting your process, try again",
                messageType: "error",
            })
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }
    @action
    startEditingProcess = () => {
        this.canEditProcess = true
    }
    @action
    stopEditingProcess = () => {
        this.canEditProcess = false
        this.resetProcessToOriginal()
    }
    @action
    private resetProcessToOriginal = () => {
        this.process = observable.map(this.originalProcess)
    }

    /*******************************************************************************************************/
    // PROJECT
    /*******************************************************************************************************/
    @observable project: ObservableMap<FormEntryType>
    @observable canEditProject: boolean = false

    @computed
    get projectView(): View {
        const curUserRole = this.employeeStore.root.sessionStore.currentUser.primaryRole
        return this.canEditProject
            ? getView(this.project.get("type") as string, curUserRole)
            : getViewAndMakeReadonly(this.project.get("type") as string, curUserRole)
    }

    @action
    updateProject = (fieldName: string, newVal: FormEntryType): void => {
        this.project.set(fieldName, String(newVal))
    }

    @action
    submitProject = async (): Promise<void> => {
        this.projectView.touchAllRequiredformFields()
        if (!this.canSubmitProject) {
            this.employeeStore.postMessage({ messageText: "please fix all form errors", messageType: "error" })
            return
        }

        try {
            this.employeeStore.setAsyncPendingLockout(true)
            const updatedProject = this.project.toJS() as CloRequestElement
            await this.dataService.updateRequestElement(updatedProject, ListName.PROJECTS)
            this.employeeStore.activeProjects.set(String(updatedProject.Id), updatedProject)
            this.employeeStore.postMessage({ messageText: "project successfully submitted", messageType: "success" })
            runInAction(() => (this.canEditProject = false))
        } catch (error) {
            console.log(error)
            this.employeeStore.postMessage({
                messageText: "there was a problem submitting your project, try again",
                messageType: "error",
            })
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitProject(): boolean {
        return !this.employeeStore.asyncPendingLockout && Utils.isObjectEmpty(this.projectValidation) && this.isRequestActive
    }

    @computed
    get projectValidation(): {} {
        return StoreUtils.validateFormControlGroup(this.projectView.formFields, this.project)
    }

    @action
    private resetProjectToOriginal = () => {
        this.project = observable.map(this.originalProject)
    }

    @action
    startEditingProject = () => {
        this.canEditProject = true
    }
    @action
    stopEditingProject = () => {
        this.canEditProject = false
        this.resetProjectToOriginal()
    }

    /*******************************************************************************************************/
    // WORK
    /*******************************************************************************************************/
    @observable work: ObservableMap<FormEntryType>
    @observable canEditWork: boolean = false

    @computed
    get workView(): View {
        const curUserRole = this.employeeStore.root.sessionStore.currentUser.primaryRole
        return this.canEditWork
            ? getView(this.work.get("type") as string, curUserRole)
            : getViewAndMakeReadonly(this.work.get("type") as string, curUserRole)
    }

    @action
    updateWork = (fieldName: string, newVal: FormEntryType): void => {
        this.work.set(fieldName, String(newVal))
    }

    @action
    submitWork = async (): Promise<void> => {
        this.workView.touchAllRequiredformFields()
        if (!this.canSubmitWork) {
            this.employeeStore.postMessage({ messageText: "please fix all form errors", messageType: "error" })
            return
        }

        try {
            this.employeeStore.setAsyncPendingLockout(true)
            const updatedWork = this.work.toJS() as CloRequestElement
            await this.dataService.updateRequestElement(updatedWork, ListName.WORKS)
            await this.employeeStore.activeWorks.set(String(updatedWork.Id), updatedWork)
            this.employeeStore.postMessage({ messageText: "work successfully submitted", messageType: "success" })
            runInAction(() => (this.canEditWork = false))
        } catch (error) {
            console.log(error)
            this.employeeStore.postMessage({
                messageText: "there was a problem submitting your work, try again",
                messageType: "error",
            })
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitWork(): boolean {
        return !this.employeeStore.asyncPendingLockout && Utils.isObjectEmpty(this.workValidation) && this.isRequestActive
    }

    @action
    startEditingWork = () => {
        this.canEditWork = true
    }
    @action
    stopEditingWork = () => {
        this.canEditWork = false
        this.resetWorkToOriginal()
    }

    @computed
    get workValidation(): {} {
        return StoreUtils.validateFormControlGroup(this.workView.formFields, this.work)
    }

    @action
    private resetWorkToOriginal = () => {
        this.work = observable.map(this.originalWork)
    }

    /*******************************************************************************************************/
    // VIEW STATE
    /*******************************************************************************************************/

    // current state of the projectWork pivot => is either "project" (show project detail) or "work" (show work detail)
    @observable pivotState: PivotState = "work"
    @action
    setPivotState = (state: PivotState) => {
        this.pivotState = state
        // if switching away from a pivot selection, reinitialize it from the original copy
        if (state === "project") {
            this.resetWorkToOriginal()
            this.canEditWork = false
        } else if (state === "work") {
            this.resetProjectToOriginal()
            this.canEditProject = false
        }
    }
}

export type PivotState = "project" | "work"
