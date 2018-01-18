import * as React from "react"
import { ClientStore } from "../store/ClientStore"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
import { observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
export interface IClientWorkTypeProps {
  styles: {
    item: {}
  }
  clientStore: ClientStore
}

export const ClientWorkType =  (props: IClientWorkTypeProps) => {
  const { clientStore, styles } = props
  return (
    <div>
      {clientStore.newProjectState.newProjectChecked && (
        <div>
          <Dropdown
            label="Select the Work Type:"
            selectedKey={clientStore.newProjectState.workType ? clientStore.newProjectState.workType : undefined}
            options={Array.from(clientStore.DataService().getWorkTypes()).map((field) => ({
              text: field,
              value: field,
              key: field,
            }))}
            placeHolder="Select an Option"
            onChanged={(e) =>
              clientStore.updateNewProjectState({
                workType: e.text,
                newWorkChecked: false,
              })
            }
            style={styles.item}
          />
        </div>
      )}
      {clientStore.newProjectState.workType && (
        <div>
          <SearchBox onFocus={() => console.log("onFocus called")} onBlur={() => console.log("onBlur called")} />
          <br />
          <Checkbox
            label="request new work"
            style={styles.item}
            checked={clientStore.newProjectState.newWorkChecked}
            onChange={() =>
              clientStore.updateForm({
                newWorkChecked: !clientStore.newProjectState.newWorkChecked,
              })
            }
          />{" "}
        </div>
      )}
      {clientStore.newProjectState.newWorkChecked && (
        <div style={styles.item}>
          <FormControlGroup
            data={clientStore.newProject}
            formControls={clientStore.DataService().getProjectFormControlsForType(clientStore.newProjectState.projectType)}
            validation={{}}
            onChange={clientStore.updateProjectTypeForm}
          />
        </div>
      )}
    </div>
  )
}