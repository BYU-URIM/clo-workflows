import { UiStore } from "./UiStore"
import { AsyncService } from "../service/AsyncService"
import { UserStore } from "./UserStore"
import { action } from "mobx"

export class RootStore {
    public uiStore: UiStore
    public userStore: UserStore

    constructor() {
        // create instances of any dependencies the child stores may have here
        const asyncService = new AsyncService()

        // construct child store instances
        this.uiStore = new UiStore(this, asyncService)
        this.userStore = new UserStore(this, asyncService)
    }

    @action public async initData() {
        await this.userStore.initData()
    }
}
