import { IRole } from "./Role"

export interface IUser {
    name: string
    username: string
    email: string
    role: IRole
}

export interface IUserDto {
    name: string
    username: string
    email: string
    roleName: string
}
