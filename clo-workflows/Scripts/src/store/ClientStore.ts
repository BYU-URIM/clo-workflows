import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { autobind } from "core-decorators"

import { FormEntryType, CloRequestElement, PROJECT_TYPES, WORK_TYPES } from "../model/CloRequestElement"
import { IFormControl } from "../model/FormControl"
import { getView } from "../model/loader/resourceLoaders"
import { IDataService } from "../service/dataService/IDataService"
import { validateFormControl } from "../utils"
import { RootStore } from "./RootStore"
import { User } from "../model/User"
import { Selection, SelectionMode, MessageBarType } from "office-ui-fabric-react"
import { IMessageProps } from "../component/Message"

export enum OBJECT_TYPES {
    NEW_PROJECT = "newProject",
    NEW_WORK = "newWork",
    NEW_PROCESS = "newProcess",
}

@autobind
export class ClientStore {
    constructor(private root: RootStore, private dataService: IDataService) {}
    @action
    async init(): Promise<void> {
        this.currentUser = this.root.sessionStore.currentUser
        await this.fetchClientProjects()
        await this.fetchClientProcesses()
        this.selectedProject = observable.map()
        this.newProject = observable.map()
        this.newProcess = observable.map()
        this.newWork = observable.map()
        this.setAsyncPendingLockout(false)
    }
    /* observable object to store data for new project as it is received, provides values for controlled create forms */
    @observable newProject: ObservableMap<FormEntryType>
    /* observable object to store data for new process as it is received, provides values for controlled create forms */
    @observable newProcess: ObservableMap<FormEntryType>
    /* observable object to store data for new work as it is received, provides values for controlled create forms */
    @observable newWork: ObservableMap<FormEntryType>
    /* all of the projects ever created by the currentUser */
    @observable projects: Array<CloRequestElement>
    /* all of the work requests that exist on the projects associated with the currentUser id */
    @observable processes: Array<CloRequestElement>
    /* the current works returned from the filtered works query */
    @observable works: Array<CloRequestElement>

    /*********** observables for viewState *************/

    /* the selected project type, defaults to undefined */
    @observable selectedProjectType?: string = undefined
    /* the selected work type, defaults to undefined */
    @observable selectedWorkType: string = undefined
    /* the Selection object used to selectedProject */
    @observable selectedProject: ObservableMap<FormEntryType>
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
    get ProjectTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedProjectType).formControls
    }
    @computed
    get WorkTypeForm(): Array<IFormControl> {
        return getView(this.viewState.selectedWorkType).formControls
    }

    /**
     * @description All state dictated by the user's direct interactions with the UI (selected project, )
     *
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
            message: this.message,
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
    async updateObject(fieldName: string, newVal: FormEntryType, objToUpdate?: OBJECT_TYPES) {
        objToUpdate ? this[objToUpdate].set(fieldName, newVal) : (this[fieldName] = newVal)
    }
    @action
    async submitNewProject(projectDetails): Promise<void> {
        this.setAsyncPendingLockout(true)
        try {
            projectDetails.submitterId = this.currentUser.Id
            projectDetails.type = this.viewState.selectedProjectType
            await this.dataService.createProject(projectDetails)
            runInAction(() => this.projects.push(projectDetails))
            this.postMessage({ messageText: "project successfully created", messageType: MessageBarType.success })
        } catch (error) {
            console.log(error)
            this.postMessage({ messageText: "there was a problem creating your new Project, try again", messageType: MessageBarType.error })
        } finally {
            this.setAsyncPendingLockout(false)
            this.closeProjectModal()
        }
    }

    @action
    async submitNewWork(workDetails): Promise<void> {
        this.setAsyncPendingLockout(true)
        try {
            workDetails.submitterId = this.currentUser.Id
            workDetails.type = this.viewState.selectedWorkType
            await this.dataService.createWork(workDetails)
            this.postMessage({ messageText: "new work request successfully created", messageType: MessageBarType.success })
        } catch (error) {
            console.log(error)
            this.postMessage({
                messageText: "there was a problem submitting your new Work request, try again",
                messageType: MessageBarType.error,
            })
        } finally {
            this.setAsyncPendingLockout(false)
            this.closeWorkModal()
        }
    }

    @action
    async submitProcess(processDetails): Promise<void> {
        processDetails.submitterId = this.currentUser.Id
        processDetails.type = this.viewState.selectedProjectType
        await this.dataService.createProcess(processDetails)
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

    /* boolean value indicating if the inputs should all be disabled , use while awaiting http requests */
    @observable asyncPendingLockout: boolean

    @action
    setAsyncPendingLockout(val: boolean) {
        this.asyncPendingLockout = val
    }

    @observable message: IMessageProps
    @action
    postMessage(message: IMessageProps, displayTime: number = 5000) {
        this.message = message
        setTimeout(
            action(() => {
                this.message = null
            }),
            displayTime
        )
    }

    @action
    private clearSelectedRequestElements(): void {
        this.viewState.selectedProject.clear()
    }

    /* TODO: implement this */
    // finds the item with the with the same ID as the new item and replaces the stale item with the new item
    // true if replacement was successfull, false if not (stale list item was not found)
    @action
    private replaceElementInListById(newItem: CloRequestElement, list: Array<any>): boolean {
        const staleItemIndex = list.findIndex(listItem => listItem.Id === newItem.Id)

        if (staleItemIndex !== -1) {
            list[staleItemIndex] = newItem
            return true
        }
        return false
    }
}
