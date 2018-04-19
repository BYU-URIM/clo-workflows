import { Employee } from "./../component/"
import { IDataService } from "../service/dataService/IDataService"
import { action, observable, runInAction } from "mobx"
import { ClientStore } from "./ClientStore/ClientStore"
import { EmployeeStore } from "./EmployeeStore/EmployeeStore"
import { SessionStore } from "./SessionStore"

export class RootStore {
    sessionStore: SessionStore
    clientStore: ClientStore // created for any anonymous (non-employee) user logged into the app
    employeeStore: EmployeeStore // created for employees logged into the app

    constructor(private dataService: IDataService) {}

    @observable public initialized: boolean = false

    @action
    async init(): Promise<void> {
        // only allow initialization if not previously initialized
        if (!this.initialized) {
            this.sessionStore = new SessionStore(this, this.dataService)

            // order of initializations matters - session store must be initialized first because other stores depend on user info
            await this.sessionStore.init()

            // create and initialize the employee store if the current user is an employee
            if (this.sessionStore.isEmployee) {
                this.employeeStore = new EmployeeStore(this, this.dataService)
                this.clientStore = new ClientStore(this, this.dataService)
                await this.employeeStore.init()
                await this.clientStore.init()
            } else {
                this.clientStore = new ClientStore(this, this.dataService)
                await this.clientStore.init()
            }

            runInAction(() => (this.initialized = true))
        }
    }
}
