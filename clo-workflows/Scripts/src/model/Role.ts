import { IStep } from "./Step"

export type RoleName = "Anonymous" | "Junior License Processor" | "Senior License Processor"
                    | "Supervisor" | "Admin Assistant" | "Administrator"

export interface IRole {
    name: RoleName
    permittedSteps: Array<IStep> // steps which are visible to members of each role
}

// Role Data - will be moved to a standalone JSON file
export const Roles = {
    Anonymous: {
        name: "Anonymous",
        permittedSteps: [
            "Intake",
        ],
    },
    JuniorLicenseProcessor: {
        name: "Junior License Processor",
        permittedSteps: [
            "Existing License",
            "Ownership Research",
            "Request Submitted",
            "Response from Rights Holder Received",
            "Receipt of License",
            "Payment",
        ],
    },
    SeniorLicenseProcessor: {
        name: "Senior License Processor",
        permittedSteps: [
            "Public Domain Research",
            "Exemption Analysis",
            "Ownership Research",
            "Request Submitted",
            "Response from Rights Holder Received",
            "Receipt of License",
            "Payment",
        ],
    },
    Supervisor: {
        name: "Supervisor",
        permittedSteps: [
            "Public Domain Approval",
            "Existing License Approval",
            "Exemption Approval",
            "CLO Response to Rights Holder",
            "Supervisor Signature",
        ],
    },
    AdminAssistant: {
        name: "Admin Assistant",
        permittedSteps: [
            "Process Payment",
        ],
    },
    Administrator: {
        name: "Administrator",
        permittedSteps: [
            "Work Approval",
        ],
    },
}
