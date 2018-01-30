import { RootStore } from "./RootStore"
import { DataService } from "../service/DataService"
import { action, ObservableMap, observable, runInAction, computed } from "mobx"
import { FormEntryType, ICloRequestElement } from "../model/CloRequestElement"
import { autobind } from "core-decorators"
import { IFormControl } from "../model/FormControl"
import { validateFormControl } from "../utils"
import { WORK_TYPES, PROJECT_TYPES } from "../model/CloRequestElement"

@autobind
export class ClientStore {
  constructor(private root: RootStore, private dataService: DataService) {}

  @action
  async init(): Promise<void> {
    this.projects = await this.dataService.fetchClientProjects()
    this.newProject = observable.map(this.projects[0])
    this.viewState = this.viewState
  }

  @observable newProject: ObservableMap<FormEntryType>
  @observable projects: Array<ICloRequestElement>

  @computed
  get newProjectFormControls(): Array<IFormControl> {
    return this.dataService.getView(this.newProject["type"])
  }

  @action
  updateNewProject(fieldName: string, newVal: FormEntryType): void {
    this.newProject.set(fieldName, newVal)
  }

  @observable
  viewState: {
    newRequestVisible: boolean
    projectTypeForm

    
  }
  @observable startNewRequest = false
  @observable newOrExisting: string
  @observable selectedProjectType?: string = undefined
  @observable selectedWorkType?: string = undefined
  @computed get ProjectTypeForm():Array<IFormControl> {
    return this.dataService.getView(this.newProject.get("type") as string)
  }  
  @computed get WorkTypeForm():Array<IFormControl> {
    return this.dataService.getView(this.newProject.get("type") as string)
  }
  @action
  updateMember(m: string, v?: any) {
    !v ? (this[m] = !this[m]) : (this[m] = v)
  }

  @computed
  get getViewState() {
    return {
      newRequestVisible: this.startNewRequest,
      newOrExisting: this.newOrExisting,
      selectedProjectType: this.selectedProjectType,
      selectedWorkType: this.selectedWorkType,
      projectTypeForm:():Array<IFormControl> => this.ProjectTypeForm,
    }
  }

  @computed get DataService() {
    return this.dataService
  }
  @action
  clear() {
    this.startNewRequest = false
    this.newOrExisting = ""
  }
  @computed get ProjectTypesAsOptions(){
    return PROJECT_TYPES.map(e => ({
      key: e,
      text: e,
    }))
  }
  @computed get WorkTypesAsOptions(){
    return WORK_TYPES.map(e => (
    {
      key: e,
      text: e
    }
    ))
  }
  @computed
  get newProjectValidation(): {} {
    return this.ProjectTypeForm.reduce((accumulator: {}, formControl: IFormControl) => {
      const fieldName: string = formControl.dataRef
      const inputVal = this.newProject.get(fieldName)
      const error: string = inputVal ? validateFormControl(formControl, inputVal) : null
      accumulator[fieldName] = error
      return accumulator
    }, {})
  }
  

}

