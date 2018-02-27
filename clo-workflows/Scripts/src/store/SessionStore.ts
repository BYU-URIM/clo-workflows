import { RootStore } from "./RootStore"
import { User } from "../model/User"
import { observable, action, computed } from "mobx"
import { IDataService } from "../service/dataService/IDataService"

export interface IFormState {
    newProjectChecked?: boolean
    newWorkChecked?: boolean
}

export class SessionStore {
    constructor(private root: RootStore, private dataService: IDataService) {}

    @observable currentUser: User

    @action
    async init(): Promise<void> {
        this.currentUser = await this.dataService.fetchUser()
    }

    @computed
    get isEmployee(): boolean {
        return this.currentUser && this.currentUser.primaryRole.name !== "Anonymous"
    }
}
