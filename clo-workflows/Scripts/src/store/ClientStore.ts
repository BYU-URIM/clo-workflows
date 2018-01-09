import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction } from "mobx"
import { FormEntryType, IRequestElement } from "../model/RequestElement"
import { autobind } from "core-decorators"

@autobind
export class ClientStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.projects = await this.dataService.fetchClientActiveProjects()
        runInAction(() => this.newProject = observable.map(this.projects[0]))
        this.newProjectState = {selectedType: ""}

    }

    @observable projects: Array<IRequestElement>
    @observable newProject: ObservableMap<FormEntryType>
    @observable newProjectState: {
        selectedType:string
    }
    @action updateNewProject(fieldName: string, newVal: FormEntryType): void {
        this.newProject.set(fieldName, newVal)
    }
    @action updateNewProjectState(selected: string): void {
        this.newProjectState.selectedType = selected
    }
    @action getDataService() {
        return this.dataService
    }
}
