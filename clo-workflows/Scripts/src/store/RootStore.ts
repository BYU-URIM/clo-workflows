import { UiStore } from "./UiStore"
import { DataService } from "../service/DataService"
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
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.uiStore = new UiStore(this, this.dataService)
        this.userStore = new UserStore(this, this.dataService)
        this.userProcessStore = new UserProcessStore(this, this.dataService)

        await this.userStore.init()
        await this.userProcessStore.init()

        // create and initialize the employee store if the current user is an employee
        if(this.userStore.isEmployee) {
            this.employeeProcessStore = new EmployeeProcessStore(this, this.dataService)
            this.employeeProcessStore.init()
        }
    }
}
