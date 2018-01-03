import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { IUser } from "../model/User"
import { observable, action, computed } from "mobx"

export class UserStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @observable currentUser: IUser

    @action async init(): Promise<void> {
        this.currentUser = await this.dataService.fetchUser()
    }

    @computed get isEmployee(): boolean {
        return this.currentUser
            && this.currentUser.role
            && this.currentUser.role.name !== "Anonymous"
    }
}
