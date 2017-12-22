import { UiStore } from "./UiStore"
import { AsyncService } from "../service/AsyncService"
import { UserStore } from "./UserStore"
import { action } from "mobx"
import { UserProcessStore } from "./UserProcessStore"
import { EmployeeProcessStore } from "./EmployeeProcessStore"

export class RootStore {
    uiStore: UiStore
    userStore: UserStore
    userProcessStore: UserProcessStore // created for anyone logged into the app - all users, including employees can submit projects
    employeeProcessStore: EmployeeProcessStore // created for employees logged into the app

    @action async init(): Promise<void> {
        // create instances of any dependencies the child stores may have here
        const asyncService = new AsyncService()

        this.uiStore = new UiStore(this, asyncService)
        this.userStore = new UserStore(this, asyncService)
        this.userProcessStore = new UserProcessStore(this, asyncService)

        await this.userStore.init()
        await this.userProcessStore.init()

        if(this.userStore.isEmployee) {
            this.employeeProcessStore = new EmployeeProcessStore(this, asyncService)
            this.employeeProcessStore.init()
        }
    }
}
