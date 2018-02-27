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
        public readonly name: string,
        public readonly username: string,
        public readonly email: string,
        public readonly Id: string,
        public readonly roles: IRole[],
    ) {}

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
