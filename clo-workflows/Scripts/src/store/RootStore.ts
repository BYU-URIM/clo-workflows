import { Employee } from './../component/Employee'
import { DataService } from "../service/DataService"
import { action } from "mobx"
import { ClientStore } from "./ClientStore"
import { EmployeeStore } from "./EmployeeStore"
import {SessionStore} from "./SessionStore"
export class RootStore {
    sessionStore: SessionStore
    clientStore: ClientStore // created for anyone logged into the app - all users, including employees can submit projects
    employeeStore: EmployeeStore // created for employees logged into the app

    constructor(
        private dataService: DataService,
    ) {}

    @action async init(): Promise<void> {
        this.sessionStore = new SessionStore(this, this.dataService)
        this.clientStore = new ClientStore(this, this.dataService)

        // order of initializations matters - user store must be initialized first because other stores depend on user info
        await this.sessionStore.init()
        await this.clientStore.init()

        // create and initialize the employee store if the current user is an employee
        if(this.sessionStore.isEmployee) {
            this.employeeStore = new EmployeeStore(this, this.dataService)
            await this.employeeStore.init()
        }
    }
}
