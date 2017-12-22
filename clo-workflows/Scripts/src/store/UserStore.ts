import { RootStore } from "./RootStore"
import { AsyncService } from "../service/AsyncService"
import { IUser } from "../model/User"
import { observable, action, computed } from "mobx"

export class UserStore {
    constructor(
        private root: RootStore,
        private asyncService: AsyncService,
    ) {}

    @observable currentUser: IUser

    @action async init(): Promise<void> {
        this.currentUser = await this.asyncService.fetchUser()
    }

    @computed get isEmployee(): boolean {
        return this.currentUser.role.name !== "anonymous"
    }
}
