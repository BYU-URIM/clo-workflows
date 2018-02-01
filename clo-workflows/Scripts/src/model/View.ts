import { IFormControl } from "./FormControl"

// View is a list of form controls rendered as a group
export interface IView {
    dataSource: string
    formControls: Array<IFormControl>
}