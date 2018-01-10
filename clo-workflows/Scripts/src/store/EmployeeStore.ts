import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { IStep } from "../model/Step"

// stores all in-progress projects, processes, and works that belong the current employee's steps
@autobind
export class EmployeeStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.projects = await this.dataService.fetchEmployeeActiveProjects()
        this.works = await this.dataService.fetchEmployeeActiveWorks()
        this.processes = await this.dataService.fetchEmployeeActiveProcesses()

        this.currentProject = observable.map(this.projects[0])
    }

    @observable processes: Array<ICloRequestElement>
    @observable works: Array<ICloRequestElement>
    @observable projects: Array<ICloRequestElement>
    @observable currentProject: ObservableMap<FormEntryType>

    @observable selectedStep: IStep

    @computed get currentProjectFormControls(): Array<IFormControl> {
        return this.dataService.getProjectFormControlsForType(this.currentProject.get("type") as string)
    }

    @action updateCurrentProject(fieldName: string, newVal: FormEntryType): void {
        this.currentProject.set(fieldName, newVal)
    }

    // computes a plain JavaScript object mapping step names process counts
    @computed get pendingProcessesByStep(): {[stepName: string]: number} {
        return this.processes.reduce((accumulator: any, process) => {
            const stepName: string = process.step as string
            accumulator[stepName] !== undefined ? accumulator[stepName]++ : accumulator[stepName] = 1
            return accumulator
        }, {})
    }
}
