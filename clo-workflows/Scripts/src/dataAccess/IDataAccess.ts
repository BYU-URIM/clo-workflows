import { IUserDto } from "../model/User"
import { IRequestElement } from "../model/RequestElement"

export interface IDataAccess {
    fetchUser(): Promise<IUserDto>
    fetchEmployeeActiveProjects(): Promise<Array<IRequestElement>>
}
