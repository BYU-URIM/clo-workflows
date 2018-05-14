import { CloRequestElement } from "."
import { observable } from "mobx"

export type StepName =
    | "Intake"
    | "Work Approval"
    | "Public Domain Research"
    | "Public Domain Approval"
    | "Existing License"
    | "Existing License Approval"
    | "Exemption Analysis"
    | "Exemption Approval"
    | "Ownership Research Licensing Exchange"
    | "Ownership Research Direct to Rights Holder"
    | "Request Submitted"
    | "Response from Rights Holder Received"
    | "CLO Response to Rights Holder"
    | "Receipt of License"
    | "Supervisor Signature"
    | "Payment"
    | "Process Payment"
    | "Complete Request"
    | "Initial Request Completion"
    | "Final Request Completion"
    | "Complete"

export interface IStep {
    name: StepName // string identifier used mostly for display purposes
    orderId: number
    view: string
    // contains the name of a view, which is a list of form controls displayed at this step
    submitterFieldName: string
    // name of the process field name corresponding to the ID of the last person to submit the process at this step
    submissionDateFieldName: string
    // name of the process field name corresponding to the date this item was submitted at this step
    processFieldNames: string[] // name of the process fields that are editable by a processor at this step
}

export class Step implements IStep {
    // copy constructor for copying JSON definition objects into observable model objects
    constructor(stepDefinition: IStep) {
        Object.assign(this, stepDefinition)
    }

    @observable name: StepName
    @observable orderId: number
    @observable view: string
    @observable submitterFieldName: string
    @observable submissionDateFieldName: string
    @observable processFieldNames: string[]
}

// this function holds all of the logic for advancing steps through the processing pipeline
// the next step is a function of of the current step and the past process state
// TODO possible to make this more typesafe??
export function getNextStepName(process: CloRequestElement, currentStep?: StepName): StepName {
    const curStepName: StepName = (process.step as StepName) || currentStep
    switch (curStepName) {
        case "Intake":
            return "Public Domain Research"
        case "Public Domain Research":
            if (process.publicDomainResearch === "Public Domain") {
                return "Public Domain Approval"
            } else if (
                process.publicDomainResearch === "Non Public Domain" ||
                process.publicDomainResearch === "Unclear"
            ) {
                return "Existing License"
            }
            return curStepName

        case "Public Domain Approval":
            if (process.publicDomainApproval === "true") {
                return "Complete"
            } else if (process.publicDomainApproval === "false") {
                return "Existing License"
            }
            return curStepName

        case "Existing License":
            if (
                process.existingLicense === "CC" ||
                process.existingLicense === "Library Database" ||
                process.existingLicense === "Terms of Use" ||
                process.existingLicense === "Permission from Rights Holder"
            ) {
                return "Existing License Approval"
            } else if (process.existingLicense === "None") {
                return "Exemption Analysis"
            }
            return curStepName

        case "Existing License Approval":
            if (process.existingLicenseApproval === "true") {
                return "Complete"
            } else if (process.existingLicenseApproval === "false") {
                return "Exemption Analysis"
            }
            return curStepName

        case "Exemption Analysis":
            if (process.exemptionAnalysis === "Fair Use") {
                return "Exemption Approval"
            } else if (process.exemptionAnalysis === "No Exemption") {
                return "Ownership Research Licensing Exchange"
            }
            return curStepName

        case "Exemption Approval":
            if (process.exemptionApproval === "true") {
                return "Complete"
            } else if (process.exemptionApproval === "false") {
                return "Ownership Research Licensing Exchange"
            }
            return curStepName

        case "Ownership Research Licensing Exchange":
            if (process.licensingExchange === "Tresona" || process.licensingExchange === "Wearethehits.com") {
                return "Request Submitted"
            } else if (process.licensingExchange === "Not found in licensing exchange") {
                return "Ownership Research Direct to Rights Holder"
            }
            return curStepName

        case "Ownership Research Direct to Rights Holder":
            if (process.directToRightsHolders) {
                return "Request Submitted"
            }
            return curStepName

        case "Request Submitted":
            if (process.requestSubmitted === "true") {
                return "Response from Rights Holder Received"
            }
            return curStepName

        case "Response from Rights Holder Received":
            if (
                process.rightsHolderResponse === "License request approved" ||
                process.rightsHolderResponse === "License request denied"
            ) {
                return "CLO Response to Rights Holder"
            }
            return curStepName

        case "CLO Response to Rights Holder":
            if (
                process.cloResponseToRightsHolder === "Cancel request" ||
                process.cloResponseToRightsHolder === "Public domain override" ||
                process.cloResponseToRightsHolder === "Exemption override" ||
                process.cloResponseToRightsHolder === "Low risk override"
            ) {
                return "Complete"
            } else if (process.cloResponseToRightsHolder === "Renegotiating") {
                return curStepName
            } else if (process.cloResponseToRightsHolder === "Rights holder offer accepted") {
                return "Receipt of License"
            }
            return curStepName

        case "Receipt of License":
            if (process.receiptOfLicense === "Signature required") {
                return "Supervisor Signature"
            } else if (process.receiptOfLicense === "Signature not Required") {
                return "Payment"
            }
            return curStepName

        case "Supervisor Signature":
            if (process.supervisorSignature === "true") {
                return "Payment"
            }
            return curStepName

        case "Payment":
            if (process.payment === "Fee required") {
                return "Process Payment"
            } else if (process.payment === "Gratis") {
                return "Complete Request"
            }
            return curStepName

        case "Process Payment":
            if (process.processPayment === "true") {
                return "Complete Request"
            }
            return curStepName

        case "Initial Request Completion":
            if (process.initialRequestCompletion === "Received fully executed license") {
                return "Complete"
            } else if (process.initialRequestCompletion === "Signed license to be sent") {
                return "Final Request Completion"
            }
            return curStepName

        case "Final Request Completion":
            if (process.finalRequestCompletion === "Countersignature received") {
                return "Complete"
            }
            return curStepName

        default:
            return curStepName
    }
}
