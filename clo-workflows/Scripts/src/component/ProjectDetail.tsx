import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { NotesBox } from "./NotesBox"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/Button"
import { SessionStore } from "../store/SessionStore"
import { NoteSource, NoteScope } from "../model/Note"

const wrapperStyle = {
    padding: "20 0",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    background: "#F8F8F8",
} as React.CSSProperties

const titleStlyes = {
    textAlign: "center",
    marginBottom: "10",
    font: "30px Segoe UI, sans-serif",
    width: 350
} as React.CSSProperties

const submitButtonStlyes = {
    display: "flex",
    justifyContent: "center",
    marginTop: 30
} as React.CSSProperties

const projectHeaderStyles = { display: "flex" }
const editButtonStyles = { transform: "translateX(-25px)" }
const formColumnStyles = { padding: "0 8 0 30" }
const notesColumnStyles = { padding: "0 30 0 8" }

@inject("rootStore")
@observer
export class ProjectDetail extends React.Component<any, any> {

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
        this.sessionStore = this.props.rootStore.sessionStore
    }

    private employeeStore: EmployeeStore
    private sessionStore: SessionStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div style={wrapperStyle}>
                <div style={formColumnStyles}>
                    <div style={projectHeaderStyles}>
                        <div style={titleStlyes}>{requestDetailStore.canEditProject ? "Edit Project" : "View Project"}</div>
                        <div style={editButtonStyles}>
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={ requestDetailStore.canEditProject ? {iconName: "BoxMultiplySolid"} : {iconName: "edit"} }
                                onClick={requestDetailStore.canEditProject
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
                    {
                        requestDetailStore.canEditProject &&
                        <div style={submitButtonStlyes}>
                            <PrimaryButton text="Submit Changes"
                                onClick={requestDetailStore.submitProject}
                                disabled={!requestDetailStore.canSubmitProject}
                            />
                        </div>
                    }
                </div>
                <div style={notesColumnStyles}>
                {
                    requestDetailStore.projectNotesStore &&
                    <NotesBox
                        notesStore={requestDetailStore.projectNotesStore}
                        title="Project Notes"
                    />
                }
                </div>
            </div>
        )
    }
}
