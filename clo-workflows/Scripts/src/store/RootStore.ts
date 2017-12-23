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

    constructor(
        private asyncService: AsyncService,
    ) {}

    @action async init(): Promise<void> {
        this.uiStore = new UiStore(this)
        this.userStore = new UserStore(this, this.asyncService)
        this.userProcessStore = new UserProcessStore(this, this.asyncService)

        await this.userStore.init()
        await this.userProcessStore.init()

        // create and initialize the employee store if the current user is an employee
        if(this.userStore.isEmployee) {
            this.employeeProcessStore = new EmployeeProcessStore(this, this.asyncService)
            this.employeeProcessStore.init()
        }
    }
}
