import * as React from "react"
import { ClientStore } from "../store/ClientStore"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
import { observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { Modal } from "office-ui-fabric-react/lib/components/Modal"
export interface IClientWorkTypeProps {
  styles: {
    item: {}
  }
  clientStore: ClientStore
}

export const ClientWorkType = (props: IClientWorkTypeProps) => {
  const { clientStore, styles } = props
  return (
    <div>
      <div>
        <Dropdown
          label="Select the Work Type:"
          selectedKey={clientStore.getViewState.selectedWorkType ? clientStore.getViewState.selectedWorkType : undefined}
          options={clientStore.WorkTypesAsOptions.map(field => {
           console.log(clientStore.WorkTypesAsOptions)
           return(field)})}
          placeHolder="Select an Option"
          onChanged={e => {
            console.log(e)
            return clientStore.updateMember("selectedWorkType", e.text)}
          }
          style={styles.item}
        />
      </div>
      
      {/* <Modal 
        isOpen={clientStore.newProjectState.showWorkModal} 
        onDismiss={clientStore.toggleWorkModal} 
        isBlocking={false} 
        containerClassName="ms-modalExample-container"
        >
        <div className="ms-modalExample-header">
          <span>Lorem Ipsum</span>
        </div>
        <div className="ms-modalExample-body">
          {clientStore.newProjectState.newWorkChecked && (
            <div style={styles.item}>
              <FormControlGroup
                data={clientStore.newProject}
                formControls={clientStore.DataService.getWorkFormControlsForType(clientStore.newProjectState.workType)}
                validation={{}}
                onChange={clientStore.updateWorkTypeForm}
              />
            </div>
          )}
        </div>
      </Modal> */}
    </div>
  )
}
