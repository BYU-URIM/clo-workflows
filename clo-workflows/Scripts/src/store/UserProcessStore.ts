import { RootStore } from "./RootStore"
import { AsyncService } from "../service/AsyncService"
import { action } from "mobx"

// stores all in-progress projects, processes, and works that the current user has submitted
export class UserProcessStore {
    constructor(
        private root: RootStore,
        private asyncService: AsyncService,
    ) {}

    @action async init(): Promise<void> {
        // fetch pending works, projects, and processes
    }
}
