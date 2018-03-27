import { IDataService } from "../../service/dataService/IDataService"
import { action, observable } from "mobx"
import { IUser } from "../../model/User"
import { NoteSource, NoteScope } from "../../model/Note"
export class ClientStoreData {
    dataService: IDataService
    currentUser: IUser
    @observable projects: Array<any> = []
    @observable processes: Array<any> = []
    @observable notes: Array<any> = []
    @observable works: Array<any> = []
    constructor(dataService: IDataService, currentUser: IUser) {
        this.dataService = dataService
        this.currentUser = currentUser
    }
    @action
    init = async () => {
        await this.fetchClientProcesses()
        await this.fetchClientProjects()
        await this.fetchWorks()
    }
    @action
    fetchClientProcesses = async () => {
        this.processes = await this.dataService.fetchClientProcesses(this.currentUser.Id)
    }
    @action
    fetchClientProjects = async () => {
        this.projects = await this.dataService.fetchClientProjects(this.currentUser.Id)
    }
    @action
    fetchWorks = async () => {
        this.works = await this.dataService.fetchWorks()
    }
    @action private fetchNotes = async () => {}
}
