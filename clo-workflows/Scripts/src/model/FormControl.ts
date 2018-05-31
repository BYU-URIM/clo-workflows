import { observable, action } from "mobx"
export interface IFormControl {
    displayName: string
    dataRef: string // reference to the field name from the model that this from control is displaying
    type: FormControlType
    choices?: Array<string>
    defaultValue?: any
    readonly?: boolean
    description?: string
}

export class FormControl implements IFormControl {
    // copy constructor for copying JSON definition objects into observable model objects
    constructor(formControlDefinition: IFormControl) {
        Object.assign(this, formControlDefinition)
        this.readonly = false
        this.touched = false
        this.description = formControlDefinition.description || ""
        if (this.type === "checkbox") {
            this.defaultValue = "false"
        }
        this.required = formControlDefinition.displayName.includes("*")
    }

    @observable displayName: string
    @observable dataRef: string // reference to the field name from the model that this from control is displaying
    @observable type: FormControlType
    @observable choices?: Array<string>
    @observable defaultValue?: any
    @observable readonly?: boolean
    @observable required?: boolean
    @observable touched: boolean
    @observable description?: string

    @action
    touch() {
        this.touched = true
    }

    @action
    makeReadOnly() {
        this.readonly = true
    }
}

export type FormControlType = "text" | "choice" | "checkbox" | "textarea" | "datetime" | "number"
