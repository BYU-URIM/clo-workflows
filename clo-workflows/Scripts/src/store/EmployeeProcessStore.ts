import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action } from "mobx"

// stores all in-progress projects, processes, and works that belong the current employee's steps
export class EmployeeProcessStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        // fetch pending works, projects, and processes
    }
}
