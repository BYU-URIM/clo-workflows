import { IFormControl, FormControl } from "./FormControl"
import { observable, action } from "mobx"

// View is a list of form controls rendered as a group
export interface IView {
    dataSource: string

    // NOTE: the JSON definition of a view consists of a formControls array and a readonlyFormControls array
    // however, once the JSON definitions are loaded into stores, the two arrays are combiined into a single formControls array
    formControls: Array<IFormControl>
}

export class View implements IView {
    // copy constructor for copying JSON definition objects into observable model objects
    constructor(viewDefinition: IView) {
        Object.assign(this, viewDefinition)
    }

    @observable dataSource: string
    @observable formControls: Array<FormControl>

    @action
    touchAllFormControls() {
        this.formControls.forEach(formControl => formControl.touch())
    }
}
