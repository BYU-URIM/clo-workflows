import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { NotesBox } from "./NotesBox"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"

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

const formColumnStyles = { padding: "0 20 0 30" }
const notesColumnStyles = { padding: "0 30 0 20" }

@inject("rootStore")
@observer
export class ProjectDetail extends React.Component<any, any> {

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        return (
            <div style={wrapperStyle}>
                <div style={formColumnStyles}>
                    <div style={titleStlyes}>View Project</div>
                    <FormControlGroup
                        data={this.employeeStore.selectedProject}
                        formControls={this.employeeStore.selectedProjectFormControls}
                        onChange={this.employeeStore.updateSelectedProject}
                        validation={{}}
                        width={350}
                    />
                    <div style={submitButtonStlyes}>
                        <PrimaryButton text="Submit Changes"
                            onClick={this.employeeStore.submitSelectedProject}
                            disabled={!this.employeeStore.canSubmitSelectedProject}
                        />
                    </div>
                </div>
                <div style={notesColumnStyles}>
                    <NotesBox
                        title="Project Notes"
                        notes={this.employeeStore.selectedProjectNotes}
                        onSubmitNoteEntry={this.employeeStore.submitProjectNoteEntry}
                        onUpdateNoteEntry={this.employeeStore.updateProjectNoteEntry}
                        noteEntry={this.employeeStore.projectNoteEntry}
                        disableButtons={this.employeeStore.asyncPendingLockout}
                    />
                </div>
            </div>
        )
    }
}