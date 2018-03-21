import { CloRequestElement } from "../../model/CloRequestElement"
import { INote } from "../../model/Note"
import { IUser } from "../../model/User"
import { ItemAddResult } from "sp-pnp-js/lib/pnp"
import { IWork } from "../../model/Work"

export interface IDataService {
    fetchUser(): Promise<IUser>
    fetchClientProcesses(): Promise<Array<CloRequestElement>>
    fetchClientProjects(): Promise<Array<CloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<CloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<CloRequestElement>>
    fetchWorkNotes(workId: string): Promise<Array<INote>>
    fetchWorks(): Promise<Array<IWork>>
    fetchProjectNotes(projectId: string): Promise<Array<INote>>
    fetchRequestElementsById(ids: number[], listName: ListName): Promise<Array<CloRequestElement>>
    createRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<CloRequestElement>
    createNote(note: INote, listName: ListName): Promise<void>
    createProject(projectData: {}): Promise<ItemAddResult>
    createProcess(processData: {}): Promise<ItemAddResult>
    createWork(workData: {}): Promise<ItemAddResult>
    updateRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<void>
}

export enum ListName {
    WORKS = "works",
    PROCESSES = "processes",
    PROJECTS = "projects",
    NOTES = "notes",
}
