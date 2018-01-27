import * as React from "react"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { ClientStore } from "../store/ClientStore"
import { SearchBox } from "office-ui-fabric-react/lib/components/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/components/Checkbox"
import FormControlGroup from "./FormControlGroup"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import { DefaultButton } from "office-ui-fabric-react/lib/Button"
import { Label } from "office-ui-fabric-react/lib/Label"

export interface IClientProjectTypeProps {
  styles?: {
    item: {}
  }
  clientStore: ClientStore
}

export const ClientProjectType = (props: IClientProjectTypeProps) => {
  const { clientStore, styles } = props
  return (
    <div>
      <Dropdown
        label="Select the Project Type:"
        selectedKey={clientStore.getViewState.selectedProjectType ? clientStore.getViewState.selectedProjectType : undefined}
        options={clientStore.fetchProjectTypesAsOptions.map((field, index) => ({
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
        style={styles.item} 
      />

      {
        clientStore.getViewState.selectedProjectType && (
          <div style={{ display: "flex", flexAlign:"right"}}>
            <FormControlGroup
              data={clientStore.newProject}
              formControls={clientStore.projectTypeForm}
              validation={{}}
              onChange={()=>console.log("hi")}
              />
          </div>
          )}
    </div>
  )
}
