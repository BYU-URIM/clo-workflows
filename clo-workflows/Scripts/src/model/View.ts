import { IFormControl, FormControl } from "."
import { observable, action } from "mobx"

// View is a list of form controls rendered as a group
export interface IView {
    dataSource: string

    formControls: Array<IFormControl>
}

export class View implements IView {
    /* copy constructor for copying JSON definition objects into observable model objects */
    constructor(viewDefinition: IView) {
        Object.assign(this, viewDefinition)
    }

    @observable dataSource: string
    @observable formControls: Array<FormControl>

    @action
    touchAllRequiredFormControls() {
        this.formControls.forEach(formControl => {
            if (formControl.required) formControl.touch()
        })
    }
}
