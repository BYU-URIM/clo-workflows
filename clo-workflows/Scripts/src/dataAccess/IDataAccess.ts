import { IUser } from "../model/User"

export interface IDataAccess {
    fetchUser(): Promise<IUser>
}
