import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction, computed} from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"

@autobind
export class ClientStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.projects = await this.dataService.fetchClientActiveProjects(this.root.sessionStore.currentUser)
        runInAction(() => {
            this.newProject = observable.map(this.projects[0])
            this.newProjectState = {projectType: "", workType:"", newProjectChecked:false, newWorkChecked:false, projectTypeForm:[{}], workTypeForm:[{}], showWorkModal:false, showProjectModal:false}
        })
    }

    @observable projects: Array<ICloRequestElement>
    @observable newProject: ObservableMap<FormEntryType>
    @observable newProjectState: {
        projectTypeForm:{}
        projectType: string,
        workType: string,
        newProjectChecked:boolean,
        newWorkChecked:boolean,
        showProjectModal:boolean,
        showWorkModal:boolean,
        workTypeForm:{}
    }
    @action updateProjectTypeForm(fieldName: string, newVal: FormEntryType): void {
        this.updateNewProjectState({projectTypeForm:[{field: fieldName, value: newVal}]})
    }
    @action updateWorkTypeForm(fieldName: string, newVal: FormEntryType): void {
        this.updateNewProjectState({workTypeForm:[{field: fieldName, value: newVal}]})
    }
    @action updateNewProjectState(form: {}): void {
        this.newProjectState = Object.assign({}, this.newProjectState, form)
    }
    get DataService() {
        return this.dataService
    }
    @action updateForm(form: {}) {
        this.newProjectState = Object.assign({}, this.newProjectState, form)
    }
    @computed get currentnewProjectState():any {
        return this.newProjectState
    }
        @action toggleWorkModal(){
        this.updateNewProjectState({ showWorkModal: !this.newProjectState.showWorkModal })
    }
    @action toggleProjectModal(){
        this.updateNewProjectState({ showProjectModal: !this.newProjectState.showProjectModal })
    }

}
