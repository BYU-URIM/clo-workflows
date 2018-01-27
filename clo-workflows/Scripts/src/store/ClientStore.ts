import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"

@autobind
export class ClientStore {
  constructor(private root: RootStore, private dataService: DataService) {}

  @action
  async init(): Promise<void> {
    this.projects = await this.dataService.fetchClientProjects()
    runInAction(() => {
      this.newProject = observable.map(this.projects[0])
  })
  }

  @observable newProject: ObservableMap<FormEntryType>
  @observable projects: Array<ICloRequestElement>
  // @observable
  // newProjectState: {
  //   projectTypeForm?: ObservableMap<FormEntryType>
  //   projectType: string
  //   workType: string
  //   newProjectChecked: boolean
  //   newWorkChecked: boolean
  //   showProjectModal: boolean
  //   showWorkModal: boolean
  //   workTypeForm: {}
    
  // }
  @observable
  viewState: {
    newRequestVisible: boolean
  }
  @observable startNewRequest = false
  @observable 
  newOrExisting: string
  @observable 
  selectedProjectType: string
  @observable
  projectTypeForm: Array<IFormControl> 
  
  @action getProjectTypeForm =()=> this.dataService.getProjectFormControlsForType(this.getViewState.selectedProjectType)
  @action
  updateMember(m:string, v?:any){    
    !v 
    ? this[m] = !this[m] 
    : this[m] = v
  }
  @observable selectedProcess: ObservableMap<FormEntryType>

  @computed
  get getViewState(){
    return({
      newRequestVisible: this.startNewRequest,
      newOrExisting: this.newOrExisting,
      selectedProjectType: this.selectedProjectType,
      projectTypeForm: (): Array<IFormControl> => this.getProjectTypeForm() 
      
    })
  }


  get DataService() {
    return this.dataService
  }
  @action 
  clear(){
    this.startNewRequest = false
    this.newOrExisting = ""
  }
  get fetchProjectTypesAsOptions(): any {
    return this.dataService.getProjectTypes().map(e => ({
      key: e,
      text: e,
    }))
  }

}

// @action
// updateForm(form: {}) {
  //   this.newProjectState = Object.assign({}, this.newProjectState, form)
  // }
  // @action
  // updateNewProjectState(form: {}): void {
    //   this.newProjectState = Object.assign({}, this.newProjectState, form)
    // }
    // @computed
    // get getNewProjectState(): any {
      //   return this.newProjectState
      // }
      // @action
      // updateProjectTypeForm(fieldName: string, newVal: FormEntryType): void {
      //   this.updateNewProjectState({ projectTypeForm: [{ field: fieldName, value: newVal }] })
      // }
      // @action
      // updateWorkTypeForm(fieldName: string, newVal: FormEntryType): void {
      //   this.updateNewProjectState({ workTypeForm: [{ field: fieldName, value: newVal }] })
      // }
      // @action
      // toggleWorkModal() {
      //   this.updateNewProjectState({ showWorkModal: !this.newProjectState.showWorkModal })
      // }
      // @action
      // toggleProjectModal() {
      //   this.updateNewProjectState({ showProjectModal: !this.newProjectState.showProjectModal })
      // }