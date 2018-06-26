import * as React from "react"
import { observer } from "mobx-react"
import { Dropdown, DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/"
import { Modal } from "office-ui-fabric-react/lib/components/Modal/Modal"
import { FormControlGroup } from "../"

import "./styles.scss"

import { ClientStore } from "../../store"

export interface IProjectFormModalProps {
    clientStore: ClientStore
}

export const ProjectFormModal = observer((props: IProjectFormModalProps) => {
    return (
        <Modal
            isOpen={true}
            onDismiss={() => {
                props.clientStore.view.modal = undefined
            }}
            isBlocking={true}
        >
            <div className="projectFormModal-styles">
                <Dropdown
                    label="Select the Project Type:"
                    selectedKey={props.clientStore.view.project.type ? props.clientStore.view.project.type : undefined}
                    options={props.clientStore.typesAsOptions.PROJECTS.map((field, index) => ({
                        text: field.text,
                        value: field.text,
                        key: field.text,
                    }))}
                    className="project-dropdown-styles"
                    placeHolder={props.clientStore.view.project.type ? props.clientStore.view.project.type : "select a project type"}
                    onChanged={e => {
                        props.clientStore.view.project.type = e.text
                    }}
                    disabled={props.clientStore.asyncPendingLockout}
                />
                {props.clientStore.view.project.type && (
                    <div>
                        <FormControlGroup
                            data={props.clientStore.newProject}
                            formControls={props.clientStore.currentForm}
                            validation={props.clientStore.currentFormValidation}
                            updateFormField={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newProject")}
                        />
                    </div>
                )}

                <div className="project-buttonbar-styles">
                    <DefaultButton
                        text="Close"
                        secondaryText="close without submitting"
                        onClick={() => {
                            props.clientStore.clearState()
                        }}
                        disabled={props.clientStore.asyncPendingLockout}
                    />
                    <PrimaryButton
                        secondaryText="Create the new project"
                        onClick={() => props.clientStore.processClientRequest()}
                        text="Create Project"
                        disabled={!props.clientStore.currentProjectFormIsValid}
                    />
                </div>
            </div>
        </Modal>
    )
})
