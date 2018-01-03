import { IUserDto } from "../model/User"

export interface IDataAccess {
    fetchUser(): Promise<IUserDto>
}
