import { IFormControl, FormControl } from "."
import { observable, action } from "mobx"

// View is a list of form controls rendered as a group
export interface IView {
    dataSource: string

    formFields: Array<IFormControl>
}

export class View implements IView {
    /* copy constructor for copying JSON definition objects into observable model objects */
    constructor(viewDefinition: IView) {
        Object.assign(this, viewDefinition)
    }

    @observable dataSource: string
    @observable formFields: Array<FormControl>

    @action
    touchAllRequiredformFields() {
        this.formFields.forEach(formControl => {
            if (formControl.required) formControl.touch()
        })
    }
}
