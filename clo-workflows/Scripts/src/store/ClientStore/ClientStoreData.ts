import { IDataService } from "../../service/dataService/IDataService"
import { action, observable, computed } from "mobx"
import { IUser } from "../../model/User"
import { NoteSource, NoteScope } from "../../model/Note"
import { IProjectGroup } from "../../component/ProjectProcessList"
import { StepName } from "../../model/Step"
import { getStep, getStepNames } from "../../model/loader/resourceLoaders"
import { CloRequestElement } from "../../model/CloRequestElement"
export class ClientStoreData {
    dataService: IDataService
    currentUser: IUser
    @observable projects: Array<any> = []
    @observable processes: Array<any> = []
    @observable process_notes: Array<any> = []
    @observable project_notes: Array<any> = []

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
        await this.fetchNotes()
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

    @action
    fetchNotes = async () => {
        this.process_notes = await this.dataService.fetchClientNotes(this.currentUser.Id)
    }

    @computed
    get clientProcesses() {
        return this.processes
            .filter(proc => this.clientProjectIds.includes(proc.projectId))
            .map((proc, i) => {
                return {
                    key: proc.Id.toString(),
                    Id: proc.Id,
                    projectId: proc.projectId,
                    title: proc.Title,
                    step: `${proc.step} - ${getStep(proc.step as StepName).orderId} out of ${getStepNames().length}`,
                    workId: proc.workId,
                }
            })
            .sort((a, b) => Number(a.projectId) - Number(b.projectId))
    }

    @computed
    get clientProjects() {
        return this.projects
            .map((proj: CloRequestElement, i): IProjectGroup => ({
                key: proj.Id.toString(),
                projectId: proj.Id.toString(),
                Title: proj.Title.toString(),
                name: proj.Title.toString(),
                count: this.processes.filter(proc => proj.Id.toString() === proc.projectId).length,
                submitterId: proj.submitterId.toString(),
                startIndex: 0,
                isShowingAll: false,
            }))
            .map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })
    }

    @computed
    get clientProjectIds() {
        return this.projects.map((proj: CloRequestElement, i): string => proj.Id.toString())
    }
}
