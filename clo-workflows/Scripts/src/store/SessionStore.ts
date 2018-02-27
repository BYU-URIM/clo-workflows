import { RootStore } from "./RootStore"
import { IUser } from "../model/User"
import { observable, action, computed } from "mobx"
import { IDataService } from "../service/dataService/IDataService"

export interface IFormState {
    newProjectChecked?: boolean
    newWorkChecked?: boolean
}

export class SessionStore {
    constructor(private root: RootStore, private dataService: IDataService, testing?: boolean) {
        this.testing = true
    }
    @observable testing: boolean

    @observable currentUser: IUser

    @action
    async init(): Promise<void> {
        this.currentUser = await this.dataService.fetchUser()
    }

    @computed
    get isEmployee(): boolean {
        return this.currentUser && (this.currentUser.roles.length > 1 ||  this.currentUser.roles[0].name !== "Anonymous")
    }
}
