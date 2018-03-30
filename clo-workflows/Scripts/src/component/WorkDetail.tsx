import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { NotesBox } from "./NotesBox"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/Button"
import { SessionStore } from "../store/SessionStore"
import { NoteScope, NoteSource } from "../model/Note"

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
    marginTop: 30,
    marginRight: 25
} as React.CSSProperties

const editButtonStyles = { transform: "translateX(-25px)" }
const workHeaderStyles = { display: "flex" } as React.CSSProperties
const formColumnStyles = { padding: "0 8 0 30" }
const notesColumnStyles = { padding: "0 30 0 8" }

@inject("rootStore")
@observer
export class WorkDetail extends React.Component<any, any> {

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
                    <div style={workHeaderStyles}>
                        <div style={titleStlyes}>{this.employeeStore.canEditSelectedWork ? "Edit Work" : "View Work"}</div>
                        <div style={editButtonStyles}>
                            <IconButton
                                iconProps={ {iconName: "edit"} }
                                onClick={this.employeeStore.toggleCanEditSelectedWork}
                            />
                        </div>
                    </div>
                    <FormControlGroup
                        data={this.employeeStore.selectedWork}
                        formControls={this.employeeStore.selectedWorkFormControls}
                        onChange={this.employeeStore.updateSelectedWork}
                        validation={this.employeeStore.selectedWorkValidation}
                        width={350}
                    />
                    {
                        this.employeeStore.canEditSelectedWork &&
                        <div style={submitButtonStlyes}>
                            <PrimaryButton text="Submit Changes"
                                onClick={this.employeeStore.submitSelectedWork}
                                disabled={!this.employeeStore.canSubmitSelectedWork}
                            />
                        </div>
                    }
                </div>
                <div style={notesColumnStyles}>
                    <NotesBox
                        title="Work Notes"
                        notes={this.employeeStore.selectedWorkNotes}
                        onCreateNote={this.employeeStore.submitNewNote}
                        onUpdateNote={this.employeeStore.updateNote}
                        onDeleteNote={this.employeeStore.deleteNote}
                        currentUser={this.sessionStore.currentUser}
                        disableButtons={this.employeeStore.asyncPendingLockout}
                        maxScope={NoteScope.EMPLOYEE}
                        noteSource={NoteSource.WORK}
                    />
                </div>
            </div>
        )
    }
}
