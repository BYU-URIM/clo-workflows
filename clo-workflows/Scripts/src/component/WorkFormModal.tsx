import { observer } from "mobx-react"
import { Dropdown } from "office-ui-fabric-react"
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import * as React from "react"

import { ClientStore, OBJECT_TYPES } from "../store/ClientStore"
import FormControlGroup from "./FormControlGroup"

export interface IFormPanelProps {
    clientStore: ClientStore
    togglePanel(m: string, v: string | boolean)
}

const WorkFormModal = (props: IFormPanelProps) => {
    return (
        <div
            style={{marginBottom: "20px"}}
            >
            <h2>New Work Form</h2>
            <Dropdown
                label="Select the Work Type:"
                selectedKey={props.clientStore.viewState.selectedWorkType ? props.clientStore.viewState.selectedWorkType : undefined}
                options={props.clientStore.WorkTypesAsOptions.map((field, index) => ({
                    text: field.text,
                    value: field.text,
                    key: field.text,
                }))}
                style={{
                    width: "200px",
                    margin: "20px 0px",
                }}
                placeHolder={
                    props.clientStore.viewState.selectedWorkType ? props.clientStore.viewState.selectedWorkType : "select a Work type"
                }
                onChanged={e => {
                    props.togglePanel("selectedWorkType", e.text)
                }}
            />
            {props.clientStore.viewState.selectedWorkType && (
                <div>
                    <FormControlGroup
                        data={props.clientStore.newWork}
                        formControls={props.clientStore.viewState.workTypeForm()}
                        validation={props.clientStore.newWorkValidation}
                        onChange={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newWork")}
                    />
                </div>
            )}
        </div>
    )
}
export default observer(WorkFormModal)
