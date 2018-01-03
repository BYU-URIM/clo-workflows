import { IUser } from "../model/User"
import {IProject} from "../model/Project";

export interface IDataAccess {
    fetchUser(): Promise<IUser>
}
