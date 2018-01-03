export interface IFormControl {
    displayName: string
    modelRef: string // reference to the field name from the model that this from control is displaying
    type: FormControlType
    choices?: Array<string>
    defaultValue?: any
    displayOnly?: boolean
    required?: boolean
}

export type FormControlType = "text" | "choice" | "checkbox" | "textarea" | "datetime" | "number"