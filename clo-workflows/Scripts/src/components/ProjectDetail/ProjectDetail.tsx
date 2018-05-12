import * as React from "react"
import { EmployeeStore, SessionStore } from "../../store"
import { inject, observer } from "mobx-react"
import { NotesBox, FormControlGroup } from "../"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/Button"
import "./styles.css"
@inject("rootStore")
@observer
export default class ProjectDetail extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
        this.sessionStore = this.props.rootStore.sessionStore
    }

    private employeeStore: EmployeeStore
    private sessionStore: SessionStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div className="projectDetail-wrapper-styles">
                <div className="projectDetail-formColumn-styles">
                    <div className="projectDetail-projectHeader-styles">
                        <div className="projectDetail-title-styles">
                            {requestDetailStore.canEditProject ? "Edit Project" : "View Project"}
                        </div>
                        <div className="projectDetail-editButton-styles">
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={requestDetailStore.canEditProject ? { iconName: "BoxMultiplySolid" } : { iconName: "edit" }}
                                onClick={
                                    requestDetailStore.canEditProject
                                        ? requestDetailStore.stopEditingProject
                                        : requestDetailStore.startEditingProject
                                }
                            />
                        </div>
                    </div>
                    <FormControlGroup
                        data={requestDetailStore.project}
                        formControls={requestDetailStore.projectView.formControls}
                        updateFormField={requestDetailStore.updateProject}
                        validation={requestDetailStore.projectValidation}
                        width={350}
                    />
                    {requestDetailStore.canEditProject && (
                        <div className="projectDetail-submitButton-styles">
                            <PrimaryButton
                                text="Submit Changes"
                                onClick={requestDetailStore.submitProject}
                                disabled={!requestDetailStore.canSubmitProject}
                            />
                        </div>
                    )}
                </div>
                <div className="projectDetail-notesColumn-styles">
                    {requestDetailStore.projectNotesStore && (
                        <NotesBox notesStore={requestDetailStore.projectNotesStore} title="Project Notes" />
                    )}
                </div>
            </div>
        )
    }
}
