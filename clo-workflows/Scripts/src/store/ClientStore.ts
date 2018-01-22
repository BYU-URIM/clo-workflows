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
        this.projects = await this.dataService.fetchClientActiveProjects()
        runInAction(() => {
            this.newProject = observable.map(this.projects[0])
            this.newProjectState = {projectType: "", workType:"", newProjectChecked:false, newWorkChecked:false}
        })
    }

    @observable projects: Array<ICloRequestElement>
    @observable newProject: ObservableMap<FormEntryType>
    @observable newProjectState: {
        projectType: string,
        workType: string,
        newProjectChecked: boolean,
        newWorkChecked: boolean,
    }
    @action updateNewProject(fieldName: string, newVal: FormEntryType): void {
        this.newProject.set(fieldName, newVal)
    }
    @action updateNewProjectState(form: {}): void {
        this.newProjectState = Object.assign({}, this.newProjectState, form)
    }
    @action DataService() {
        return this.dataService
    }
    @action updateForm(form: {}) {
        this.newProjectState = Object.assign({}, this.newProjectState, form)
    }
    @computed get currentnewProjectState(): any {
        return this.newProjectState
    }
}
