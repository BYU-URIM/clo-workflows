import * as React from "react"
import { observer } from "mobx-react"
import { FormControlGroup } from "../"
import "./styles.scss"

import { ClientStore } from "../../store"

export interface IWorkFormProps {
    clientStore: ClientStore
}

export const WorkForm = observer((props: IWorkFormProps) => {
    return (
        <div className={"workForm-wrapper-styles"}>
            {props.clientStore.view.work.type && (
                <div>
                    <FormControlGroup
                        data={props.clientStore.newWork}
                        formFields={props.clientStore.currentForm}
                        validation={props.clientStore.currentFormValidation}
                        updateFormField={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newWork")}
                    />
                </div>
            )}
        </div>
    )
})
