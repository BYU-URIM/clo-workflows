import { IRequestElement } from './../model/RequestElement'
import { IUserDto } from "../model/User"

export interface IDataAccess {
    fetchUser(): Promise<IUserDto>
    fetchEmployeeActiveProjects(): Promise<Array<IRequestElement>>
    fetchClientActiveProjects(): Promise<Array<IRequestElement>>
}
