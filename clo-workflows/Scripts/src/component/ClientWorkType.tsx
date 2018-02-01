import * as React from "react"
import { ClientStore } from "../store/ClientStore"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
import { observer, inject } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { Modal } from "office-ui-fabric-react/lib/components/Modal"
@inject("rootStore")
@observer
export class ClientWorkType extends React.Component<any, any> {
  render() {
    const {clientStore} = this.props.rootStore
    
    return (
      <div style={{ minHeight: "500px" }}>
          <Dropdown
            label="Select the Work Type:"
            selectedKey={clientStore.getViewState.selectedWorkType ? clientStore.getViewState.selectedWorkType : undefined}
            options={clientStore.WorkTypesAsOptions.map(field => {
              console.log(clientStore.WorkTypesAsOptions)
              return field
            })}
            placeHolder="Select an Option"
            onChanged={e => {
              console.log(e)
              return clientStore.updateMember("selectedWorkType", e.text)
            }}
          />

        {clientStore.getViewState.selectedWorkType && (
          <FormControlGroup
          data={clientStore.newProject}
          formControls={clientStore.getViewState.workTypeForm()}
          validation={clientStore.newWorkValidation}
          onChange={clientStore.updateNewProject}
          />
        )}
      </div>
    )
  }
}
