import { IFormControl } from "./FormControl"

type StepName = "Intake" | "Work Approval" | "Public Domain Research" | "Public Domain Approval" | "Existing License"
                    | "Existing License Approval" | "Exemption Analysis" | "Exemption Approval"
                    | "Ownership Research" | "Request Submitted" | "Response from Rights Holder Received"
                    | "CLO Response to Rights Holder" | "Receipt of License" | "Supervisor Signature" | "Payment"
                    | "Process Payment" | "Complete Request" | "Completing the License Request"

export interface IStep {
    name: StepName
    processFormControls: Array<IFormControl>
}
