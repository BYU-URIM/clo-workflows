import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { autobind } from "core-decorators"

import { FormEntryType, CloRequestElement, PROJECT_TYPES, WORK_TYPES } from "../model/CloRequestElement"
import { IFormControl } from "../model/FormControl"
import { getView } from "../model/loader/resourceLoaders"
import { IDataService } from "../service/dataService/IDataService"
import { validateFormControl } from "../utils"
import { RootStore } from "./RootStore"
import { User } from "../model/User"
import {Selection} from "office-ui-fabric-react"

@autobind
export class ClientStore {
    constructor(private root: RootStore, private dataService: IDataService) {}
    @action
    async init(): Promise<void> {
        this.currentUser = this.root.sessionStore.currentUser
        await this.fetchClientProjects()
        await this.fetchClientProcesses()
        this.selectedProject = new Selection({
            
        })
        this.newProject = (await this.projects.length) > 0 ? observable.map(this.projects[0]) : observable.map()
    }

    @observable newProject: ObservableMap<FormEntryType>
    @observable projects: Array<CloRequestElement>
    @observable processes: Array<CloRequestElement>
    currentUser
    @computed
    get clientProjects(): Array<CloRequestElement> {
        return this.projects
    }
    @computed
    get newProjectFormControls(): Array<IFormControl> {
        return getView(this.newProject.get("type") as string).formControls
    }
    @action
    handleSelectionChange(e: {projectId:string}){
        this.selectedProject.selectToKey(e.projectId)
    }
    @action
    async updateNewProject(fieldName: string, newVal: FormEntryType) {
        this.newProject.set(fieldName, newVal)
    }
    @action
    async submitNewProject(projectDetails: {}): Promise<void> {
        await this.dataService.createProject(projectDetails).then(async () => {
            await this.fetchClientProjects()
        })
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

    /* viewState holds all of the information that determines the current
    state of the view including info to track the request creation state,
    which options are displayed, which inputs are valid, etc.
    */

    @computed
    get viewState() {
        return {
            newRequestVisible: this.startedNewRequest,
            newOrExistingProject: this.newOrExistingProject,
            newOrExistingWork: this.newOrExistingWork,
            selectedProject: this.selectedProject,
            selectedProjectType: this.selectedProjectType,
            selectedWorkType: this.selectedWorkType,
            projectTypeForm: (): Array<IFormControl> => this.ProjectTypeForm,
            isSelectedProject : this.isSelectedProject,
            workTypeForm: (): Array<IFormControl> => this.WorkTypeForm,
            showProjectPanel: this.showProjectPanel,
        }
    }

    /****************************************
     * viewState members
     ****************************************/
    @observable startedNewRequest = false
    @observable newOrExistingProject: string
    @observable selectedProjectType?: string = undefined
    @observable selectedProject: Selection
    @observable isSelectedProject: boolean = false
    @observable newOrExistingWork: string
    @observable selectedWorkType?: string = undefined
    @observable showProjectPanel: boolean = false
    @observable showProcessPanel: boolean = false

    /***************************************
     * computed members
     ***************************************/
    @computed
    get ProjectTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedProjectType).formControls
    }
    @computed
    get WorkTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedWorkType).formControls
    }
    @action
    IsSelectedProject(){
        this.isSelectedProject = !(this.selectedProject.getSelectedCount() === 0)
    }

    /***************************************
     * actions
     ***************************************/

    @action
    updateMember(m: string, v?: any) {
        !v ? (this[m] = !this[m]) : (this[m] = v)
    }
    @action
    updateViewState = (m: string, v?: string | boolean | undefined) => {
        v ? this[m] = v
        : this[m] = undefined
    }

    /*************************************
     * ref & util stuff
     *************************************/

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
}
