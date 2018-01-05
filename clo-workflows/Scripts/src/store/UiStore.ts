import { RootStore } from "./RootStore"
import { IFormControl } from "../model/FormControl"
import { DataService } from "../service/DataService"

export class UiStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {
        this.workFormControls = this.dataService.getWorkFormControls()
        this.projectFormControls = this.dataService.getProjectFormControls()
    }

    readonly workFormControls: Map<string, Array<IFormControl>>
    readonly projectFormControls: Map<string, Array<IFormControl>>

}
