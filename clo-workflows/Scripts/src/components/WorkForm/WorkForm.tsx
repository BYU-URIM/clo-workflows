import * as React from "react"
import { observer } from "mobx-react"
import { Dropdown } from "office-ui-fabric-react/lib/"
import { ClientStore } from "../../store"
import { FormControlGroup } from "../"
import "./styles.scss"

export interface IFormPanelProps {
    clientStore: ClientStore
}

const WorkForm = (props: IFormPanelProps) => {
    return (
        <div className={"workForm-wrapper-styles"}>
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
