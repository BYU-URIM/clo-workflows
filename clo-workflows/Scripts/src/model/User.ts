import { IRole } from "./Role"
import { observable, computed } from "mobx"

export interface IUser {
    name: string
    username: string
    email: string,
    Id: string,
    roles: IRole[]
    primaryRole: IRole
}

// while the other model interfaces define the shape for plain javascript objects
// the user class implements the IUser interface to provide an easy / efficient implementation of the primaryRole property
// other than the primaryRole functionality, this class is just a container for data conforming to the IUser interface
export class User implements IUser {
    constructor(
        name: string,
        username: string,
        email: string,
        Id: string,
        roles: IRole[],
    ) {
        this.name = name
        this.username = username
        this.email = email
        this.Id = Id
        this.roles = roles
    }

    @observable readonly name: string
    @observable readonly username: string
    @observable readonly email: string
    @observable readonly Id: string
    @observable readonly roles: IRole[]

    // primary role is the highest ranked role a user has
    // ex. if a user has the admin, senior license processor, and junior license processor roles, then primaryRole = admin
    // this value is a lazy loaded private value wrapped in a getter
    private _primaryRole = null
    get primaryRole(): IRole {
        if(!this._primaryRole) this._primaryRole = this.roles.length && this.roles.sort((roleA, roleB) => roleA.rank > roleB.rank ? -1 : 1)[0]
        return this._primaryRole
    }
}

export interface IUserDto {
    name: string
    username: string
    email: string,
    Id: string,
    roleNames: string[]
}
