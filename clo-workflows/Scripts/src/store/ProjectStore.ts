import { RootStore } from "./RootStore"
import { AsyncService } from "../service/AsyncService"
import { action } from "mobx"

// stores all active projects, processes, and works
export class ProjectStore {
    constructor(
        private root: RootStore,
        private asyncService: AsyncService,
    ) {}

    @action async initData() {
        // fetch pending works, projects, and processes
    }
}
