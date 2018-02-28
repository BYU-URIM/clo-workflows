import { RootStore } from "./RootStore"
import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { FormEntryType, CloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { validateFormControl } from "../utils"
import { WORK_TYPES, PROJECT_TYPES } from "../model/CloRequestElement"
import { IView } from "../model/View"
import { IDataService } from "../service/dataService/IDataService"
import { getView } from "../model/loader/resourceLoaders"

@autobind
export class ClientStore {
    constructor(private root: RootStore, private dataService: IDataService) {}
    /**
     * @description
     * @author Tyler Gilland - @tgilland95
     * @returns {Promise<void>}
     * @memberof ClientStore
     */
    @action
    async init(): Promise<void> {
        const currentUser = this.root.sessionStore.currentUser

        this.projects = await this.dataService.fetchClientActiveProjects(currentUser)
        this.newProject = observable.map(this.projects[0])
        this.viewState = this.viewState
        this.choices = {
            project: [
                {
                    key: "new",
                    text: "New Project",
                },
                {
                    key: "existing",
                    text: "Exisitng Project",
                },
            ],
            work: [
                {
                    key: "existing",
                    text: "Choose from existing Work",
                },
                {
                    key: "new",
                    text: "Request new Work",
                },
            ],
        }
    }

    /**
     * @description Clietnt Data
     * @type {ObservableMap<FormEntryType>}
     * @memberof ClientStore
     */
    @observable newProject: ObservableMap<FormEntryType>
    @observable projects: Array<CloRequestElement>
    @computed
    get clientProjects(): Array<CloRequestElement> {
        return this.projects
    }
    @computed
    get newProjectFormControls(): Array<IFormControl> {
        return getView(this.newProject.get("type") as string).formControls
    }

    choices
    @action
    updateNewProject(fieldName: string, newVal: FormEntryType): void {
        this.newProject.set(fieldName, newVal)
    }

    /* viewState holds all of the information that determines the current
    state of the view including info to track the request creation state,
    which options are displayed, which inputs are valid, etc.
    */
    /**
     * @description
     * @type {{
     *     newRequestVisible: boolean
     *     projectTypeForm?: Array<IFormControl>
     *   }}
     * @memberof ClientStore
     */
    @observable
    viewState: {
        newRequestVisible: boolean
        projectTypeForm?: Array<IFormControl>
    }
    @computed
    get getViewState() {
        return {
            newRequestVisible: this.startedNewRequest,
            newOrExistingProject: this.newOrExistingProject,
            newOrExistingWork: this.newOrExistingWork,
            selectedProjectType: this.selectedProjectType,
            selectedWorkType: this.selectedWorkType,
            projectTypeForm: (): Array<IFormControl> => this.ProjectTypeForm,
            workTypeForm: (): Array<IFormControl> => this.WorkTypeForm,
        }
    }
    /****************************************
     * viewState members
     ****************************************/
    @observable startedNewRequest = false
    @observable newOrExistingProject: string
    @observable selectedProjectType?: string = undefined
    @observable newOrExistingWork: string
    @observable selectedWorkType?: string = undefined

    /***************************************
     * computed members
     ***************************************/
    @computed
    get ProjectTypeForm(): Array<IFormControl> {
        return getView(this.newProject.get("type") as string).formControls
    }
    @computed
    get WorkTypeForm(): Array<IFormControl> {
        return getView(this.newProject.get("type") as string).formControls
    }
    /***************************************
     * actions
     ***************************************/

    @action
    updateMember(m: string, v?: any) {
        !v ? (this[m] = !this[m]) : (this[m] = v)
    }

    @action
    clear() {
        this.startedNewRequest = false
        this.newOrExistingProject = ""
        this.newOrExistingWork = ""
        this.selectedProjectType = ""
        this.selectedWorkType = ""
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
        //   }
        //   @computed get selectedProcessValidation(): {} {
        //     return this.selectedProcessFormControls.reduce((accumulator: {}, formControl: IFormControl) => {
        //         const fieldName: string = formControl.dataRef
        //         const inputVal = this.selectedProcess.get(fieldName)
        //         const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
        //         accumulator[fieldName] = error
        //         return accumulator
        //     }, {})
    }
}
