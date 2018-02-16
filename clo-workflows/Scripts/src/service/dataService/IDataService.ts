import { ICloRequestElement } from "../../model/CloRequestElement"
import { INote } from "../../model/Note"
import { IUser } from "../../model/User"

export interface IDataService {
    fetchUser(): Promise<IUser>
    fetchClientProjects(): Promise<Array<ICloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchProjectsById(ids: number[]): Promise<Array<ICloRequestElement>>
    fetchWorksById(activeProcesses: number[]): Promise<Array<ICloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>>
    fetchWorkNotes(workId: number): Promise<Array<INote>>
    fetchProjectNotes(projectId: number): Promise<Array<INote>>
}
