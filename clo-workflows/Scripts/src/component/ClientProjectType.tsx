import * as React from "react"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { ClientStore } from "../store/ClientStore"
import { SearchBox } from "office-ui-fabric-react/lib/components/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/components/Checkbox"
import FormControlGroup from "./FormControlGroup"
import { Modal } from "office-ui-fabric-react/lib/Modal"
import { inject, observer } from "mobx-react"

@inject("rootStore")
@observer
export class ClientProjectType extends React.Component<any, any> {
    clientStore: ClientStore
    render() {
        this.clientStore = this.props.rootStore.clientStore
        return (
            <div>
                <Dropdown
                    label="Select the Project Type:"
                    selectedKey={
                        this.clientStore.viewState.selectedProjectType ? this.clientStore.viewState.selectedProjectType : undefined
                    }
                    options={this.clientStore.TypesAsOptions.PROJECTS.map((field, index) => ({
                        text: field.text,
                        value: field.text,
                        key: field.text,
                    }))}
                    placeHolder={
                        this.clientStore.viewState.selectedProjectType
                            ? this.clientStore.viewState.selectedProjectType
                            : "select a project type"
                    }
                    onChanged={e => this.clientStore.updateMember("selectedProjectType", e.text)}
                />

                {this.clientStore.viewState.selectedProjectType && (
                    <div>
                        <FormControlGroup
                            data={this.clientStore.newProject}
                            formControls={this.clientStore.viewState.projectTypeForm()}
                            validation={this.clientStore.newProjectValidation}
                            onChange={(fieldName, value) => this.clientStore.updateClientStoreMember(fieldName, value, "newProject")}
                        />
                    </div>
                )}
            </div>
        )
    }
}
