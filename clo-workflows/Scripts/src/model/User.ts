import { IRole } from "./Role"
import { observable, computed } from "mobx"

export interface IUser {
    name: string
    username: string
    email: string
    roles: IRole[]
}

export class User {
    constructor(
        name: string,
        username: string,
        email: string,
        roles: IRole[]
    ) {
        this.name = name
        this.username = username
        this.email = email
        this.roles = roles
    }

    @observable name: string
    @observable username: string
    @observable email: string
    @observable roles: IRole[]

    @computed get primaryRole(): IRole {
        return this.roles.length && this.roles.sort((roleA, roleB) => roleA.rank > roleB.rank ? -1 : 1)[0]
    }
}

export interface IUserDto {
    name: string
    username: string
    email: string
    roleNames: string[]
}
