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
    updateView(m: string, v: string | boolean)
}

const ProjectFormModal = (props: IFormPanelProps) => {
    return (
        <Modal
            isOpen={props.clientStore.view.showProjectModal}
            onDismiss={() => {
                props.updateView("showProjectModal", false)
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
                        props.clientStore.view.projectType ? props.clientStore.view.projectType : undefined
                    }
                    options={props.clientStore.typesAsOptions.PROJECTS.map((field, index) => ({
                        text: field.text,
                        value: field.text,
                        key: field.text,
                    }))}
                    style={{
                        width: "200px",
                        margin: "20px 0px",
                    }}
                    placeHolder={
                        props.clientStore.view.projectType
                            ? props.clientStore.view.projectType
                            : "select a project type"
                    }
                    onChanged={e => {
                        props.updateView("projectType", e.text)
                    }}
                    disabled={props.clientStore.view.asyncPendingLockout}
                />
                {props.clientStore.view.projectType && (
                    <div>
                        <FormControlGroup
                            data={props.clientStore.newProject}
                            formControls={props.clientStore.currentForm}
                            validation={props.clientStore.currentFormValidation}
                            onChange={(fieldName, value) => props.clientStore.updateClientStoreMember(fieldName, value, "newProject")}
                        />
                    </div>
                )}

                <PrimaryButton
                    description="Create the new project"
                    onClick={() => props.clientStore.processClientRequest()}
                    text="Create Project"
                    disabled={props.clientStore.view.asyncPendingLockout}
                />
                <br />
                <br />
                <DefaultButton
                    text="Close"
                    description="close without submitting"
                    onClick={() => {
                        props.updateView("showProjectModal", false)
                    }}
                    disabled={props.clientStore.view.asyncPendingLockout}
                />
            </div>
            <br />
            <br />
        </Modal>
    )
}
export default observer(ProjectFormModal)
