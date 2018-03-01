import { CloRequestElement } from "../../model/CloRequestElement"
import { INote } from "../../model/Note"
import { IUser } from "../../model/User"

export interface IDataService {
    fetchUser(): Promise<IUser>
    fetchClientProcesses(client: IUser): Promise<Array<CloRequestElement>>
    fetchCurrentUserId():any
    fetchClientProjects(): Promise<Array<CloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<CloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<CloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<CloRequestElement>>
    fetchWorkNotes(workId: string): Promise<Array<INote>>
    fetchProjectNotes(projectId: string): Promise<Array<INote>>
    fetchRequestElementsById(ids: number[], listName: ListName): Promise<Array<CloRequestElement>>
    createRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<CloRequestElement>
    updateRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<void>
    createNote(note: INote, listName: ListName): Promise<void>
}

export enum ListName {
    WORKS = "works",
    PROCESSES = "processes",
    PROJECTS = "projects",
    NOTES = "notes"
}
