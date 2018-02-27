import { ICloRequestElement } from "../../model/CloRequestElement"
import { INote } from "../../model/Note"
import { User } from "../../model/User"

export interface IDataService {
    fetchUser(): Promise<User>
    fetchClientProjects(): Promise<Array<ICloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProcesses(employee: User): Promise<Array<ICloRequestElement>>
    fetchClientActiveProjects(client: User): Promise<Array<ICloRequestElement>>
    fetchWorkNotes(workId: string): Promise<Array<INote>>
    fetchProjectNotes(projectId: string): Promise<Array<INote>>
    fetchRequestElementsById(ids: number[], listName: ListName): Promise<Array<ICloRequestElement>>
    createRequestElement(requestElement: ICloRequestElement, listName: ListName): Promise<ICloRequestElement>
    updateRequestElement(requestElement: ICloRequestElement, listName: ListName): Promise<void>
    createNote(note: INote, listName: ListName): Promise<void>
}

export enum ListName {
    WORKS = "works",
    PROCESSES = "processes",
    PROJECTS = "projects",
    NOTES = "notes"
}
