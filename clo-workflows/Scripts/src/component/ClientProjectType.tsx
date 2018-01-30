import * as React from "react"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { ClientStore } from "../store/ClientStore"
import { SearchBox } from "office-ui-fabric-react/lib/components/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/components/Checkbox"
import FormControlGroup from "./FormControlGroup"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import { DefaultButton } from "office-ui-fabric-react/lib/Button"
import { Label } from "office-ui-fabric-react/lib/Label"
import { inject, observer } from "mobx-react"

export interface IClientProjectTypeProps {

  clientStore: ClientStore
}
@inject("rootStore")
@observer
export class ClientProjectType extends React.Component<any, any>{
  render(){
    const {clientStore} = this.props.rootStore
    return (
      <div>
      <Dropdown
        label="Select the Project Type:"
        selectedKey={clientStore.getViewState.selectedProjectType ? clientStore.getViewState.selectedProjectType : undefined}
        options={clientStore.ProjectTypesAsOptions.map((field, index) => ({
          text: field.text,
          value: field.text,
          key: field.text,
        }))}
        placeHolder={clientStore.getViewState.selectedProjectType ? clientStore.getViewState.selectedProjectType : "select a project type"}
        onChanged={(e) =>{
          clientStore.updateMember(
            "selectedProjectType", e.text,
          )
        }
      }
      />

      {
        clientStore.getViewState.selectedProjectType && (
          <div>
            <FormControlGroup
              data={clientStore.newProject}
              formControls={clientStore.getViewState.projectTypeForm()}
              validation={clientStore.newProjectValidation}
              onChange={clientStore.updateNewProject}
              />
          </div>
          )}
    </div>
  )
}
}
