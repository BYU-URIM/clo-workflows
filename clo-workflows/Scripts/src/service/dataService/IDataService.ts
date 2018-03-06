import { CloRequestElement } from "../../model/CloRequestElement"
import { INote } from "../../model/Note"
import { IUser } from "../../model/User"

export interface IDataService {
    fetchUser(): Promise<IUser>
    fetchClientProcesses(): Promise<Array<CloRequestElement>>
    fetchClientProjects(): Promise<Array<CloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<CloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<CloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<CloRequestElement>>
    fetchWorkNotes(workId: string): Promise<Array<INote>>
    fetchProjectNotes(projectId: string): Promise<Array<INote>>
    fetchRequestElementsById(ids: number[], listName: ListName): Promise<Array<CloRequestElement>>
    createRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<CloRequestElement>
    createNote(note: INote, listName: ListName): Promise<void>
    createProject(ProjectData:{}):Promise<void>
    createProcess(process: any):Promise<void>
    updateRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<void>
    
}

export enum ListName {
    WORKS = "works",
    PROCESSES = "processes",
    PROJECTS = "projects",
    NOTES = "notes"
}
