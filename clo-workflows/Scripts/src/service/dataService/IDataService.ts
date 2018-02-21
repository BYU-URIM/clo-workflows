import { ICloRequestElement } from "../../model/CloRequestElement"
import { INote } from "../../model/Note"
import { IUser } from "../../model/User"

export interface IDataService {
    fetchUser(): Promise<IUser>
    fetchClientProjects(): Promise<Array<ICloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>>
    fetchWorkNotes(workId: number): Promise<Array<INote>>
    fetchProjectNotes(projectId: number): Promise<Array<INote>>
    fetchRequestElementsById(ids: number[], listName: ListName): Promise<Array<ICloRequestElement>>
    createRequestElement(requestElement: ICloRequestElement, listName: ListName): Promise<ICloRequestElement>
    updateRequestElement(requestElement: ICloRequestElement, listName: ListName): Promise<void>
}

export enum ListName {
    WORKS = "works",
    PROCESSES = "processes",
    PROJECTS = "projects",
    NOTES = "notes"
}
