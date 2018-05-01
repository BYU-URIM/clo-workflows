import { RootStore } from "./"
import { IUser } from "../model"
import { observable, action, computed } from "mobx"
import { IDataService } from "../service/"

export interface IFormState {
    newProjectChecked?: boolean
    newWorkChecked?: boolean
}

export class SessionStore {
    constructor(private root: RootStore, private dataService: IDataService) {}

    @observable currentUser: IUser

    @action
    async init(): Promise<void> {
        this.currentUser = await this.dataService.fetchUser()
        if(!this.isEmployee) this.dataService.ensureClient(this.currentUser)
    }

    @computed
    get isEmployee(): boolean {
        return this.currentUser && this.currentUser.primaryRole.name !== "LTT Client"
    }
}
