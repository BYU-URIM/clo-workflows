import * as React from "react"
import { autobind } from "office-ui-fabric-react/lib/Utilities"
import { DefaultButton } from "office-ui-fabric-react/lib/Button"
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel"
import FormControlGroup from "./FormControlGroup"
import { observer, inject } from "mobx-react"
import { ClientStore } from "../store/ClientStore"
import { Dropdown } from "office-ui-fabric-react"

export interface IFormPanelProps {
    clientStore: ClientStore
    togglePanel(m: string, v: string | boolean)
}

const FormPanel = (props: IFormPanelProps) => {
    return (
        <div>
           <Panel
                isOpen={props.clientStore.showProjectPanel}
                onDismiss={() => {
                    props.togglePanel("showProjectPanel", false)
                }}
                type={PanelType.medium}
                headerText="New Project Form"
            >
                <div>
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
                        placeHolder={
                            props.clientStore.viewState.selectedProjectType
                                ? props.clientStore.viewState.selectedProjectType
                                : "select a project type"
                        }
                        onChanged={e => {
                            props.togglePanel("selectedProjectType", e.text)
                        }}
                    />
                    {props.clientStore.viewState.selectedProjectType && (
                        <div>
                            <FormControlGroup
                                data={props.clientStore.newProject}
                                formControls={props.clientStore.viewState.projectTypeForm()}
                                validation={props.clientStore.newProjectValidation}
                                onChange={props.clientStore.updateNewProject}
                            />
                            <DefaultButton
                                description="Create the new project"
                                onClick={() => props.clientStore.submitNewProject(props.clientStore.newProject.toJSON())}
                                text="Create Project"
                            />
                        </div>
                    )}
                </div>{" "}
            </Panel>
        </div>
    )
}

export default observer(FormPanel)
