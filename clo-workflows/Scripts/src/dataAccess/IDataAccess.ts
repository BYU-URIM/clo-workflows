import { ICloRequestElement } from "./../model/CloRequestElement"
import { IUserDto, IUser } from "../model/User"

export interface IDataAccess {
    fetchUser(): Promise<IUserDto>
    fetchClientProjects(): Promise<Array<ICloRequestElement>>
    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveProjects(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchEmployeeActiveWorks(employee: IUser): Promise<Array<ICloRequestElement>>
    fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>>
}
