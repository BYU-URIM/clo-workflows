import { observable, action, computed } from "mobx"
import { RootStore } from "../"
import { IUser } from "../../model/"
import { IDataService } from "../../service/"

export class SessionStore {
    constructor(private root: RootStore, private dataService: IDataService) {}

    @observable currentUser: IUser

    @action
    async init(): Promise<void> {
        this.currentUser = await this.dataService.fetchUser()
    }

    @computed
    get isEmployee(): boolean {
        return this.currentUser && this.currentUser.primaryRole.name !== "LTT Client"
    }

    @computed
    get isAdmin(): boolean {
        return this.currentUser && this.currentUser.primaryRole.name === "Administrator"
    }
}
