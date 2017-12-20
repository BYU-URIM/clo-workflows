import { UiStore } from "./UiStore"
import { AsyncService } from "../service/AsyncService"
import { UserStore } from "./UserStore"
import { action } from "mobx"
import { ProjectStore } from "./ProjectStore"

export class RootStore {
    uiStore: UiStore
    userStore: UserStore
    projectStore: ProjectStore

    constructor() {
        // create instances of any dependencies the child stores may have here
        const asyncService = new AsyncService()

        // construct child store instances
        this.uiStore = new UiStore(this, asyncService)
        this.userStore = new UserStore(this, asyncService)
        this.projectStore = new ProjectStore(this, asyncService)
    }

    @action async initData(): Promise<void> {
        // order of store initializations matters
        // many things depend on the user and user's role, so the user store should fetch data first
        await this.userStore.initData()
        await this.projectStore.initData()
    }
}
