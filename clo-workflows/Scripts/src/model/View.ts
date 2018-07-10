import { IFormControl, FormControl } from "."
import { observable, action } from "mobx"

// View is a list of form controls rendered as a group
export interface IView {
    dataSource: string
    formFields: Array<FormControl>
    privilegedFormFields?: Array<FormControl>
    readOnlyFormFields?: Array<FormControl>
}

export class View implements IView {
    /* copy constructor for copying JSON definition objects into observable model objects */
    constructor(viewDef: IView) {
        Object.assign(this, viewDef)
        if (!viewDef.privilegedFormFields) this.privilegedFormFields = []
        if (!viewDef.readOnlyFormFields) this.readOnlyFormFields = []
    }

    @observable dataSource: string
    @observable formFields: Array<FormControl>
    @observable privilegedFormFields?: Array<FormControl>
    @observable readOnlyFormFields?: Array<FormControl>
    @action
    touchAllRequiredformFields() {
        this.formFields.forEach(formControl => {
            if (formControl.required) formControl.touch()
        })
    }
}
