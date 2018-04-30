import { observer } from "mobx-react"
import { Dropdown } from "office-ui-fabric-react"
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import * as React from "react"

import { ClientStore } from "../../store/ClientStore/ClientStore"
import { FormControlGroup } from "../"
import "./styles.css"

export interface IFormPanelProps {
    clientStore: ClientStore
}

const WorkForm = (props: IFormPanelProps) => {
    return (
        <div className={"workForm-wrapper-styles"}>
            <Dropdown
                label="Select the Work Type:"
                selectedKey={props.clientStore.view.work.type || undefined}
                options={props.clientStore.typesAsOptions.WORKS}
                className={"workForm-dropDown-styles"}
                placeHolder={props.clientStore.view.work.type || "select a Work type"}
                onChanged={e => {
                    props.clientStore.view.work.type = e.text
                }}
            />
            {props.clientStore.view.work.type && (
                <div>
                    <FormControlGroup
                        data={props.clientStore.newWork}
                        formControls={props.clientStore.currentForm}
                        validation={props.clientStore.currentFormValidation}
                        updateFormField={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newWork")}
                    />
                </div>
            )}
        </div>
    )
}
export default observer(WorkForm)
