import { ICloRequestElement } from "./../model/CloRequestElement"
import { IUserDto, IUser } from "../model/User"
import { INote } from "../model/Note"

export interface IDataAccess {
    fetchUser(): Promise<IUserDto>
    fetchClientProjects(): Promise<Array<ICloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProjects(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveWorks(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>>
    fetchWorkNotes(workId: number): Promise<Array<INote>>
    fetchProjectNotes(projectId: number): Promise<Array<INote>>
}
