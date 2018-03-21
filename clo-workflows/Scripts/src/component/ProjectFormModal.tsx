import { observer } from "mobx-react"
import { Dropdown } from "office-ui-fabric-react"
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel"
import { Modal } from "office-ui-fabric-react/lib/Modal"

import * as React from "react"

import { ClientStore } from "../store/ClientStore"
import FormControlGroup from "./FormControlGroup"

export interface IFormPanelProps {
    clientStore: ClientStore
    togglePanel(m: string, v: string | boolean)
}

const ProjectFormModal = (props: IFormPanelProps) => {
    return (
        <Modal
            isOpen={props.clientStore.showProjectModal}
            onDismiss={() => {
                props.togglePanel("showProjectModal", false)
            }}
            isBlocking={true}
        >
            <div
                style={{
                    height: "80vh",
                    width: "40vw",
                    padding: "32px",
                }}
            >
                <Dropdown
                    label="Select the Project Type:"
                    selectedKey={
                        props.clientStore.viewState.selectedProjectType ? props.clientStore.viewState.selectedProjectType : undefined
                    }
                    options={props.clientStore.ProjectTypesAsOptions.map((field, index) => ({
                        text: field.text,
                        value: field.text,
                        key: field.text,
                    }))}
                    style={{
                        width: "200px",
                        margin: "20px 0px",
                    }}
                    placeHolder={
                        props.clientStore.viewState.selectedProjectType
                            ? props.clientStore.viewState.selectedProjectType
                            : "select a project type"
                    }
                    onChanged={e => {
                        props.togglePanel("selectedProjectType", e.text)
                    }}
                    disabled={props.clientStore.asyncPendingLockout}
                />
                {props.clientStore.viewState.selectedProjectType && (
                    <div>
                        <FormControlGroup
                            data={props.clientStore.newProject}
                            formControls={props.clientStore.viewState.projectTypeForm()}
                            validation={props.clientStore.newProjectValidation}
                            onChange={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newProject")}
                        />
                    </div>
                )}

                <PrimaryButton
                    description="Create the new project"
                    onClick={() => props.clientStore.submitNewProject(props.clientStore.newProject.toJSON())}
                    text="Create Project"
                    disabled={props.clientStore.asyncPendingLockout}
                />
                <br />
                <br />
                <DefaultButton
                    description="close without submitting"
                    text="Clear and Cancel"
                    onClick={() => {
                        props.clientStore.closeProjectModal()
                    }}
                    disabled={props.clientStore.asyncPendingLockout}
                />
                <DefaultButton
                    text="Close"
                    description="close without submitting"
                    onClick={() => {
                        props.togglePanel("showProjectModal", false)
                    }}
                    disabled={props.clientStore.asyncPendingLockout}
                />
            </div>
            <br />
            <br />
        </Modal>
    )
}
export default observer(ProjectFormModal)
