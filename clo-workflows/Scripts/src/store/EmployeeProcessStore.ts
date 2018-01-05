import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction } from "mobx"
import { FormEntryType, IRequestElement } from "../model/RequestElement"
import { autobind } from "core-decorators"

// stores all in-progress projects, processes, and works that belong the current employee's steps
@autobind
export class EmployeeProcessStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.projects = await this.dataService.fetchEmployeeActiveProjects()
        runInAction(() => this.currentProject = observable.map(this.projects[0]))
    }

    @observable projects: Array<IRequestElement>
    @observable currentProject: ObservableMap<FormEntryType>

    @action updateCurrentProject(fieldName: string, newVal: FormEntryType): void {
        this.currentProject.set(fieldName, newVal)
    }
}
