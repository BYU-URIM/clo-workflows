import { IDataService } from "../../service/dataService/IDataService"
import { action, observable } from "mobx"
import { IUser } from "../../model/User"
export class ClientStoreData {
    dataService: IDataService
    currentUser: IUser
    @observable projects: Array<any> = []
    @observable processes: Array<any> = []
    @observable processWorkNotes: Array<any>
    @observable works: Array<any> = []
    constructor(dataService: IDataService, currentUser: IUser) {}
    @action
    private fetchClientProcesses = async () => {
        this.processes = await this.dataService.fetchClientProcesses(this.currentUser.Id)
    }
    @action
    private fetchClientProjects = async () => {
        this.projects = await this.dataService.fetchClientProjects(this.currentUser.Id)
    }
    @action
    private fetchWorks = async () => {
        this.works = await this.dataService.fetchWorks()
    }
}
