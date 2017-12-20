import { IRole } from "./Role"

export interface IUser {
    name: string
    username: string
    email: string
    role: IRole
}
