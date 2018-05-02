import { CloRequestElement, IUser, IWork, INote, NoteSource, NoteScope, User } from "../../model"
import { ItemAddResult } from "@pnp/sp"

export interface IDataService {
    fetchUser(): Promise<IUser>
    ensureClient(user: IUser): Promise<void>
    fetchClientNotes(userId: string): Promise<Array<INote>>
    fetchClientProcesses(userId: string): Promise<Array<CloRequestElement>>
    fetchClientProjects(userId: string): Promise<Array<CloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<CloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<CloRequestElement>>
    fetchWorks(): Promise<Array<IWork>>
    fetchRequestElementsById(ids: number[], listName: ListName): Promise<Array<CloRequestElement>>
    searchProcessesByTitle(searchTerm: string): Promise<Array<CloRequestElement>>
    createRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<CloRequestElement>
    createProject(projectData: {}): Promise<ItemAddResult>
    createProcess(processData: {}): Promise<ItemAddResult>
    createWork(workData: {}): Promise<ItemAddResult>
    updateRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<void>
    createNote(note: INote): Promise<ItemAddResult>
    fetchNotes(source: NoteSource, scope: NoteScope, sourceId: string, attachedClientId: string): Promise<Array<INote>>
    updateNote(note: INote): Promise<void>
    deleteNote(noteId: number): Promise<void>
}

export enum ListName {
    WORKS = "works",
    PROCESSES = "processes",
    PROJECTS = "projects",
    NOTES = "notes",
}
