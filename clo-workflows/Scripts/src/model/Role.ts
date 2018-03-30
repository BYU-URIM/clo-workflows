import { IStep } from "./Step"
import { observable } from "mobx"

export interface IRole {
    name: string
    permittedSteps: Array<IStep> // steps which are visible to members of each role
    rank: number // ranks are ordered from low to high => admin is highest rank (i.e. 5), anonymous is lowest rank (i.e. 0)
}

export class Role implements IRole {
    // copy constructor for copying JSON definition objects into observable model objects
    constructor(roleDefinition: IRole) {
        Object.assign(this, roleDefinition)
    }

    @observable name: string
    @observable permittedSteps: Array<IStep>
    @observable rank: number
}
