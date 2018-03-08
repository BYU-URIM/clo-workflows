import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { autobind } from "core-decorators"

import { FormEntryType, CloRequestElement, PROJECT_TYPES, WORK_TYPES } from "../model/CloRequestElement"
import { IFormControl } from "../model/FormControl"
import { getView } from "../model/loader/resourceLoaders"
import { IDataService } from "../service/dataService/IDataService"
import { validateFormControl } from "../utils"
import { RootStore } from "./RootStore"
import { User } from "../model/User"
import { Selection, SelectionMode } from "office-ui-fabric-react"

@autobind
export class ClientStore {
    constructor(private root: RootStore, private dataService: IDataService) {}
    @action
    async init(): Promise<void> {
        this.currentUser = this.root.sessionStore.currentUser
        await this.fetchClientProjects()
        await this.fetchClientProcesses()
        this.selectedProject = new Selection({
            selectionMode: SelectionMode.multiple,
            onSelectionChanged: () => {
                console.log("the selection was changed in the store")
            },
        })
        this.newProject = observable.map()
        this.newProcess = observable.map()
        this.newWork = observable.map()
    }

    @observable newProject: ObservableMap<FormEntryType>
    @observable newProcess: ObservableMap<FormEntryType>
    @observable newWork: ObservableMap<FormEntryType>
    @observable projects: Array<CloRequestElement>
    @observable processes: Array<CloRequestElement>

    /*********** observables for viewState *************/

    /* the selected project type, defaults to undefined */
    @observable selectedProjectType?: string = undefined
    /* the selected work type, defaults to undefined */
    @observable selectedWorkType: string = undefined
    /* the Selection object used to selectedProject */
    @observable selectedProject: Selection
    /* should the project modal be visible or not */
    @observable showProjectModal: boolean = false
    /* should the process modal be visible or not */
    @observable showProcessModal: boolean = false
    /* should the work modal be visible or not */
    @observable showWorkModal: boolean = false

    /* current user object */
    currentUser

    /************ Computed Values ****************/

    @computed
    get clientProjects(): Array<CloRequestElement> {
        return this.projects
    }
    @computed
    get newProjectFormControls(): Array<IFormControl> {
        return getView(this.newProject.get("type") as string).formControls
    }
    @computed
    get ProjectTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedProjectType).formControls
    }
    @computed
    get WorkTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedWorkType).formControls
    }

    /*****************
     * viewState holds all of the information that determines the current
     * state of the view including info to track the request creation state,
     * which options are displayed, which inputs are valid, etc.
     */

    @computed
    get viewState() {
        return {
            selectedProject: this.selectedProject,
            selectedProjectType: this.selectedProjectType,
            selectedWorkType: this.selectedWorkType,
            projectTypeForm: (): Array<IFormControl> => this.ProjectTypeForm,
            workTypeForm: (): Array<IFormControl> => this.WorkTypeForm,
            showProjectModal: this.showProjectModal,
            showProcessModal: this.showProcessModal,
        }
    }

    @computed
    get DataService() {
        return this.dataService
    }

    @computed
    get ProjectTypesAsOptions() {
        return PROJECT_TYPES.map(e => ({
            key: e,
            text: e,
        }))
    }
    @computed
    get WorkTypesAsOptions() {
        return WORK_TYPES.map(e => ({
            key: e,
            text: e,
        }))
    }
    @computed
    get ProcessTypesAsOptions() {
        return WORK_TYPES.map(e => ({
            key: e,
            text: e,
        }))
    }
    @computed
    get newProjectValidation(): {} {
        return this.ProjectTypeForm.reduce((accumulator: {}, formControl: IFormControl) => {
            const fieldName: string = formControl.dataRef
            const inputVal = this.newProject.get(fieldName)
            const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
            accumulator[fieldName] = error
            return accumulator
        }, {})
    }
    @computed
    get newWorkValidation(): {} {
        return this.WorkTypeForm.reduce((accumulator: {}, formControl: IFormControl) => {
            const fieldName: string = formControl.dataRef
            const inputVal = this.newProject.get(fieldName) || undefined
            const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
            accumulator[fieldName] = error
            return accumulator
        }, {})
    }

    /************ Actions ***************/

    @action
    handleSelectionChange(e: { projectId: string }) {
        this.selectedProject.selectToKey(e.projectId)
    }
    @action
    async updateNewProject(fieldName: string, newVal: FormEntryType) {
        this.newProject.set(fieldName, newVal)
    }
    @action
    async updateNewProcess(fieldName: string, newVal: FormEntryType) {
        this.newProcess.set(fieldName, newVal)
    }
    @action
    async updateNewWork(fieldName: string, newVal: FormEntryType) {
        this.newWork.set(fieldName, newVal)
    }
    @action
    async submitNewProject(projectDetails): Promise<void> {
        projectDetails.submitterId = this.currentUser.Id
        projectDetails.type = this.viewState.selectedProjectType
        console.log(projectDetails)
        await this.dataService.createProject(projectDetails).then(async () => {
            await this.fetchClientProjects()
        })
        await this.fetchClientProjects()
        this.closeProjectModal()
    }

    @action
    async submitNewWork(workDetails): Promise<void> {
        workDetails.submitterId = this.currentUser.Id
        workDetails.type = this.viewState.selectedWorkType
        console.log(workDetails)
        await this.dataService.createWork(workDetails).then(async () => {
            await this.fetchClientProjects()
            await this.fetchClientProcesses()
        })
        this.closeWorkModal()
    }

    @action
    async submitProcess(processDetails): Promise<void> {
        processDetails.submitterId = this.currentUser.Id
        processDetails.type = this.viewState.selectedProjectType
        await this.dataService.createProcess(processDetails).then(async () => {
            await this.fetchClientProjects()
            await this.fetchClientProcesses()
        })
        await this.fetchClientProjects()
        this.closeProcessModal()
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
        this.showProcessModal = false
    }

    @action
    closeWorkModal() {
        this.newWork = observable.map()
        this.selectedWorkType = undefined
        this.showWorkModal = false
    }

    @action
    async fetchClientProjects() {
        this.projects = await this.dataService.fetchClientProjects().then(projs => {
            return projs.filter(p => {
                return p.submitterId === this.currentUser.Id
            })
        })
    }

    @action
    async fetchClientProcesses() {
        this.processes = await this.dataService.fetchClientProcesses().then(projs => {
            return projs.filter(p => {
                return p.submitterId === this.currentUser.Id
            })
        })
    }
    @action
    updateMember(m: string, v?: any) {
        !v ? (this[m] = !this[m]) : (this[m] = v)
    }
    @action
    updateViewState = (m: string, v?: string | boolean | undefined) => {
        v ? (this[m] = v) : (this[m] = undefined)
    }
}
