import { IStep } from "./Step"

export interface IRole {
    name: string
    permittedSteps: Array<IStep> // steps which are visible to members of each role
}
