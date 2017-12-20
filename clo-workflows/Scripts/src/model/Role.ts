import { IStep } from "./IStep"

type RoleName = "anonymous" | "Junior License Processor" | "Senior License Processor"
                    | "Supervisor" | "Admin Assistant" | "Administrator"

export interface IRole {
    name: RoleName
    steps: Array<IStep> // steps which are visible to members of each role
}
