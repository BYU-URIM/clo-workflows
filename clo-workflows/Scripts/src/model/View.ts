import { IFormControl } from "./FormControl"

// View is a list of form controls rendered as a group
export interface IView {
    dataSource: string

    // NOTE: the JSON definition of a view consists of a formControls array and a readonlyFormControls array
    // however, once the JSON definitions are loaded into stores, the two arrays are combiined into a single formControls array
    formControls: Array<IFormControl>
}
