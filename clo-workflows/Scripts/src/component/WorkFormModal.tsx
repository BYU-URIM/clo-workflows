import { observer } from "mobx-react"
import { Dropdown } from "office-ui-fabric-react"
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import * as React from "react"

import { ClientStore } from "../store/ClientStore/ClientStore"
import FormControlGroup from "./FormControlGroup"

export interface IFormPanelProps {
    clientStore: ClientStore
}

const WorkFormModal = (props: IFormPanelProps) => {
    return (
        <div style={{ marginBottom: "20px" }}>
            <h2>New Work Form</h2>
            <Dropdown
                label="Select the Work Type:"
                selectedKey={props.clientStore.view.workType ? props.clientStore.view.workType : undefined}
                options={props.clientStore.typesAsOptions.WORKS.map((field, index) => ({
                    text: field.text,
                    value: field.text,
                    key: field.text,
                }))}
                style={{
                    width: "200px",
                    margin: "20px 0px",
                }}
                placeHolder={props.clientStore.view.workType ? props.clientStore.view.workType : "select a Work type"}
                onChanged={e => {
                    props.clientStore.view.workType = e.text
                }}
            />
            {props.clientStore.view.workType && (
                <div>
                    <FormControlGroup
                        data={props.clientStore.newWork}
                        formControls={props.clientStore.currentForm}
                        validation={props.clientStore.currentFormValidation}
                        onChange={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newWork")}
                    />
                </div>
            )}
        </div>
    )
}
export default observer(WorkFormModal)
