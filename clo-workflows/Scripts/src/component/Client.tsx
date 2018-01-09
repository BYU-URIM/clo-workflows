import * as React from "react"
import { inject, observer } from "mobx-react"

import { IUser } from "../model/User"
import Header from "./Header"
import FormControlGroup from "./FormControlGroup"
import {SessionStore} from "../store/SessionStore"
import {ClientStore} from "../store/ClientStore"
import {Dropdown} from "office-ui-fabric-react/lib/Dropdown"
import {WorkType} from "../model/Work"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"

export interface IWorkTypeDropdownProps {
  workTypes: Array<WorkType>
  setNewProjectState: any
}
const styles = {
  maxWidth: "350px",
}

@inject("rootStore")
@observer
export class Anonymous extends  React.Component<any, any> {
  public componentWillMount() {
    this.sessionStore = this.props.rootStore.sessionStore

    this.clientStore = this.props.rootStore.clientStore
  }
  sessionStore: SessionStore
  clientStore: ClientStore

  render() {
    const options  = [{ key: "Header", text: "Work Types", itemType: Header }]
    const pt = this.clientStore.getDataService().getProjectTypes()
    // const projectTypes = this.clientStore.getDataService().getProjectFormControls().keys()
    const {newProject} = this.clientStore
    
  return (
    <div style={styles}>
    <Dropdown
      className="WorkTypeDropdownClass"
      label="Select the Work Type:"
      selectedKey={this.clientStore.newProjectState.selectedType ? this.clientStore.newProjectState.selectedType : undefined}
      options = {Array.from(pt).map(field=>({text:field, value: field, key: field}))}
      placeHolder="Select an Option"
      onChanged={(e)=>this.clientStore.updateNewProjectState(e.text)}
    />
          
          <SearchBox 
                    onFocus={ () => console.log('onFocus called') }
                    onBlur={ () => console.log('onBlur called') }
          />
    
{
  this.clientStore.newProjectState.selectedType &&
        <FormControlGroup
          data={this.clientStore.newProject} 
          formControls={this.clientStore.getDataService().getProjectFormControlsForType("Synch")}
          validation={{}} 
          onChange={this.clientStore.updateNewProject}
        />
     }     </div>
      
      
    )
  }
}
