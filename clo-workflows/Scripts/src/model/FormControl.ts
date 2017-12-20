export interface IFormControl {
    displayName: string
    modelRef: string // reference to the field name from the model that this from control is displaying
    type: FormControlType
    metadata?: any // any extra data that does not fit into given fields i.e. choices for choice column
    defaultValue?: any
    displayOnly?: boolean
    required?: boolean
}

export type FormControlType = "text" | "choice" | "checkbox" | "textarea" | "datetime" | "number"
