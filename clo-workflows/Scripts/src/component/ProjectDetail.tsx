import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { NotesBox } from "./NotesBox"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/Button"
import { SessionStore } from "../store/SessionStore"
import { NoteSource } from "../model/Note"

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
        return (
            <div style={wrapperStyle}>
                <div style={formColumnStyles}>
                    <div style={projectHeaderStyles}>
                        <div style={titleStlyes}>{this.employeeStore.canEditSelectedProject ? "Edit Project" : "View Project"}</div>
                        <div style={editButtonStyles}>
                            <IconButton
                                iconProps={ {iconName: "edit"} }
                                onClick={this.employeeStore.toggleCanEditSelectedProject}
                            />
                        </div>
                    </div>
                    <FormControlGroup
                        data={this.employeeStore.selectedProject}
                        formControls={this.employeeStore.selectedProjectFormControls}
                        onChange={this.employeeStore.updateSelectedProject}
                        validation={{}}
                        width={350}
                    />
                    {
                        this.employeeStore.canEditSelectedProject &&
                        <div style={submitButtonStlyes}>
                            <PrimaryButton text="Submit Changes"
                                onClick={this.employeeStore.submitSelectedProject}
                                disabled={!this.employeeStore.canSubmitSelectedProject}
                            />
                        </div>
                    }
                </div>
                <div style={notesColumnStyles}>
                    <NotesBox
                        title="Project Notes"
                        notes={this.employeeStore.selectedProjectNotes}
                        onCreateNote={this.employeeStore.submitNewNote}
                        onDeleteNote={this.employeeStore.deleteNote}
                        onUpdateNote={this.employeeStore.updateNote}
                        disableButtons={this.employeeStore.asyncPendingLockout}
                        currentUser={this.sessionStore.currentUser}
                        noteSource={NoteSource.PROJECT}
                    />
                </div>
            </div>
        )
    }
}
