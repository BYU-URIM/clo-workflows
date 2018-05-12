import { observable, computed, action, runInAction, ObservableMap } from "mobx"
import { FormEntryType, CloRequestElement } from "../../model/CloRequestElement"
import { EmployeeStore, EmployeeViewKey } from "./EmployeeStore"
import { IDataService, ListName } from "../../service/dataService/IDataService"
import { autobind } from "core-decorators"
import { getView, getViewAndMakeReadonly, getStepForProcessFieldName, getStep } from "../../model/loader/resourceLoaders"
import { View } from "../../model/View"
import Utils from "../../utils"
import { StoreUtils } from ".."
import { StepName, getNextStepName } from "../../model/Step"
import { IFormControl } from "../../model/FormControl"
import { NotesStore } from "../"
import { NoteSource, NoteScope } from "../../model/Note"

@autobind
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
    }

    @observable workNotesStore: NotesStore
    @observable projectNotesStore: NotesStore

    @action
    async init(): Promise<void> {
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
        return (this.process.get("step") as StepName) !== "Complete"
    }

    /*******************************************************************************************************/
    // PROCESSES
    /*******************************************************************************************************/
    @observable process: ObservableMap<FormEntryType>

    @computed
    get processView(): View {
        if (this.isRequestActive) return getView(this.employeeStore.focusStep.view, true)
        else {
            return getView("Complete", true)
        }
    }

    getProcessSubmissionMetadata(formControl: IFormControl): string {
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
        return !this.employeeStore.asyncPendingLockout && Utils.isObjectEmpty(this.processValidation) && this.isRequestActive
    }

    @computed
    get processValidation(): {} {
        return StoreUtils.validateFormControlGroup(this.processView.formControls, this.process)
    }

    @action
    updateProcess(fieldName: string, newVal: FormEntryType): void {
        this.process.set(fieldName, String(newVal))
    }

    @action
    async submitProcess(): Promise<void> {
        this.processView.touchAllRequiredFormControls()
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
                    step: getNextStepName(updatedProcess),
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
            this.employeeStore.postMessage({ messageText: "there was a problem submitting your process, try again", messageType: "error" })
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    /*******************************************************************************************************/
    // PROJECT
    /*******************************************************************************************************/
    @observable project: ObservableMap<FormEntryType>
    @observable canEditProject: boolean = false

    @computed
    get projectView(): View {
        return this.canEditProject ? getView(this.project.get("type") as string, true) : getViewAndMakeReadonly(this.project.get("type") as string)
    }

    @action
    updateProject(fieldName: string, newVal: FormEntryType): void {
        this.project.set(fieldName, String(newVal))
    }

    @action
    async submitProject(): Promise<void> {
        this.projectView.touchAllRequiredFormControls()
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
            this.employeeStore.postMessage({ messageText: "there was a problem submitting your project, try again", messageType: "error" })
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
        return StoreUtils.validateFormControlGroup(this.projectView.formControls, this.project)
    }

    @action
    private resetProjectToOriginal() {
        this.project = observable.map(this.originalProject)
    }

    @action
    startEditingProject() {
        this.canEditProject = true
    }
    @action
    stopEditingProject() {
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
        return this.canEditWork ? getView(this.work.get("type") as string, true) : getViewAndMakeReadonly(this.work.get("type") as string)
    }

    @action
    updateWork(fieldName: string, newVal: FormEntryType): void {
        this.work.set(fieldName, String(newVal))
    }

    @action
    async submitWork(): Promise<void> {
        this.workView.touchAllRequiredFormControls()
        if (!this.canSubmitWork) {
            this.employeeStore.postMessage({ messageText: "please fix all form errors", messageType: "error" })
            return
        }

        try {
            this.employeeStore.setAsyncPendingLockout(true)
            const updatedWork = this.work.toJS() as CloRequestElement
            await this.dataService.updateRequestElement(updatedWork, ListName.WORKS)
            this.employeeStore.activeWorks.set(String(updatedWork.Id), updatedWork)
            this.employeeStore.postMessage({ messageText: "work successfully submitted", messageType: "success" })
            runInAction(() => (this.canEditWork = false))
        } catch (error) {
            console.log(error)
            this.employeeStore.postMessage({ messageText: "there was a problem submitting your work, try again", messageType: "error" })
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    @computed
    get canSubmitWork(): boolean {
        return !this.employeeStore.asyncPendingLockout && Utils.isObjectEmpty(this.workValidation) && this.isRequestActive
    }

    @action
    startEditingWork() {
        this.canEditWork = true
    }
    @action
    stopEditingWork() {
        this.canEditWork = false
        this.resetWorkToOriginal()
    }

    @computed
    get workValidation(): {} {
        return StoreUtils.validateFormControlGroup(this.workView.formControls, this.work)
    }

    @action
    private resetWorkToOriginal() {
        this.work = observable.map(this.originalWork)
    }

    /*******************************************************************************************************/
    // VIEW STATE
    /*******************************************************************************************************/

    // current state of the projectWork pivot => is either "project" (show project detail) or "work" (show work detail)
    @observable pivotState: PivotState = "work"
    @action
    setPivotState(state: PivotState) {
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
