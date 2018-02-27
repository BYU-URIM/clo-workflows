import { IStep } from "./Step"

export interface IRole {
    name: string
    permittedSteps: Array<IStep> // steps which are visible to members of each role
    rank: number // ranks are ordered from low to high => admin is highest rank (i.e. 5), anonymous is lowest rank (i.e. 0)
}
