import { IFormControl } from "./FormControl"

type StepName = "Intake" | "Public Domain Research" | "Public Domain Approval" | "Existing License"
                    | "Existing License Approval" | "Supervisor" | "Exemption Analysis" | "Exemption Approval"
                    | "Ownership Research" | "Request Submitted" | "Response from Rights Holder Received"
                    | "CLO Response to Rights Holder" | "Receipt of License" | "Supervisor Signature" | "Payment"
                    | "Complete Request" | "Completing the License Request"

export interface IStep {
    name: StepName
    processFormControls: Array<IFormControl>
}
