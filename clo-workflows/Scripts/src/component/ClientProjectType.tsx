import * as React from "react"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { ClientStore } from "../store/ClientStore"
import { SearchBox } from "office-ui-fabric-react/lib/components/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/components/Checkbox"
import FormControlGroup from "./FormControlGroup"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import { DefaultButton } from "office-ui-fabric-react/lib/Button"
export interface IClientProjectTypeProps {
  styles: {
    item: {}
  }
  clientStore: ClientStore
}

export const ClientProjectType = (props: IClientProjectTypeProps) => {
  const { clientStore, styles } = props
  return (
    <div>
      <Dropdown
        className="WorkTypeDropdownClass"
        label="Select the Project Type:"
        selectedKey={clientStore.newProjectState.projectType ? clientStore.newProjectState.projectType : undefined}
        options={Array.from(clientStore.DataService.getProjectTypes()).map((field) => ({
          text: field,
          value: field,
          key: field,
        }))}
        placeHolder="Select an Option"
        onChanged={(e) =>
          clientStore.updateNewProjectState({
            projectType: e.text,
            newProjectChecked: false,
            workType: "",
            newWorkChecked: false,
          })
        }
        style={styles.item}
      />
      {clientStore.newProjectState.projectType && (
        <div>
          <SearchBox onFocus={() => console.log("onFocus called")} onBlur={() => console.log("onBlur called")} style={styles.item} />
          <br />
          <Checkbox
            label="Create new project"
            style={styles.item}
            checked={clientStore.newProjectState.newProjectChecked}
            onChange={() => {
              clientStore.updateForm({ newProjectChecked: !clientStore.newProjectState.newProjectChecked 
              })
              clientStore.toggleProjectModal()
            }}
          />
        </div>
      )}

      <Modal 
        isOpen={clientStore.newProjectState.showProjectModal} 
        onDismiss={clientStore.toggleProjectModal} 
        isBlocking={false} 
        containerClassName="ms-modalExample-container"
        >
        <div className="ms-modalExample-header" >
          <span>Lorem Ipsum</span>
        </div>
        <div className="ms-modalExample-body">
        {clientStore.currentnewProjectState.newProjectChecked && (
        <FormControlGroup
          data={clientStore.newProject}
          formControls={clientStore.DataService.getProjectFormControlsForType(clientStore.newProjectState.projectType)}
          validation={{}}
          onChange={clientStore.updateProjectTypeForm}
        />
      )}
        </div>
      </Modal>
    </div>
  )
}
