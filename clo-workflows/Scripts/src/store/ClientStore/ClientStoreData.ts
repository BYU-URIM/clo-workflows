import { IDataService } from "../../service/dataService/IDataService"
import { action, observable, computed, runInAction, ObservableMap } from "mobx"
import { IUser, StepName, CloRequestElement } from "../../model"
import { NoteSource, NoteScope } from "../../model/"
import { IProjectGroup } from "../../components/"
import { getStep, getStepNames } from "../../model/loader/resourceLoaders"
import { INote } from "../../model/Note"

export class ClientStoreData {
    dataService: IDataService
    currentUser: IUser
    @observable projects: Array<any> = []
    @observable processes: Array<any> = []
    @observable process_notes: Array<any> = []
    @observable project_notes: Array<any> = []

    @observable workNotesByWorkId: ObservableMap<INote[]>
    @observable projectNotesByProjectId: ObservableMap<INote[]>

    @observable works: Array<any> = []
    constructor(dataService: IDataService, currentUser: IUser) {
        this.dataService = dataService
        this.currentUser = currentUser
    }
    @action
    init = async () => {
        await this.fetchClientProcesses()
        await this.fetchClientProjects()
        this.fetchWorks()
        this.fetchNotes()
    }
    fetchClientProcesses = async () => {
        const processes = await this.dataService.fetchClientProcesses(this.currentUser.Id)
        runInAction(() => this.processes = processes)
    }
    fetchClientProjects = async () => {
        const projects = await this.dataService.fetchClientProjects(this.currentUser.Id)
        runInAction(() => this.projects = projects)
    }
    fetchWorks = async () => {
        const works = await this.dataService.fetchWorks()
        runInAction(() => this.works = works)
    }
    fetchNotes = async () => {
        this.projectNotesByProjectId = observable.map()
        this.workNotesByWorkId = observable.map()
        const allNotes = await this.dataService.fetchClientNotes(this.currentUser.Id)
        allNotes.forEach(note => {
            if(note.projectId) {
                if(this.projectNotesByProjectId.get(note.projectId))
                    runInAction(() => this.projectNotesByProjectId.get(note.projectId).push(note))
                else
                    runInAction(() => this.projectNotesByProjectId.set(note.projectId, observable([note])))
            }
            else if(note.workId) {
                if(this.workNotesByWorkId.get(note.workId))
                    runInAction(() => this.workNotesByWorkId.get(note.workId).push(note))
                else
                    runInAction(() => this.workNotesByWorkId.set(note.workId, observable([note])))
            }
        })
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
