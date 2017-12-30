import { IStep } from "./Step"

export type RoleName = "Anonymous" | "Junior License Processor" | "Senior License Processor"
                    | "Supervisor" | "Admin Assistant" | "Administrator"

export interface IRole {
    name: RoleName
    permittedSteps: Array<IStep> // steps which are visible to members of each role
}
