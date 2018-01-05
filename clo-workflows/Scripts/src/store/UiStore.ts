import { RootStore } from "./RootStore"
import { IFormControl } from "../model/FormControl"
import { DataService } from "../service/DataService"
import { observable, action } from "mobx"
import { IUser } from "../model/User"

export class UiStore {
    constructor(
        private root: RootStore,
        private dataService: DataService,
    ) {}

    @observable workFormControls: Map<string, Array<IFormControl>> // maps work type name to form controls
    @observable projectFormControls: Map<string, Array<IFormControl>> // maps project type name to form controls
    @observable permittedProcessFormControls: Map<string, Array<IFormControl>> // maps permitted step name to form controls

    @action init(): void {
        this.workFormControls = this.dataService.getWorkFormControls()
        this.projectFormControls = this.dataService.getProjectFormControls()
        this.permittedProcessFormControls = this.dataService.getPermittedProcessFormControls(this.root.userStore.currentUser)
    }

}
