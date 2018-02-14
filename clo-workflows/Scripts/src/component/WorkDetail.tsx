import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import NotesBox from "./NotesBox"

const wrapperStyle = {
    background: "#F8F8F8",
    padding: "20 0",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
} as React.CSSProperties

const titleStlyes = {
    textAlign: "center",
    marginBottom: "10",
    font: "30px Segoe UI, sans-serif",
    width: 350
} as React.CSSProperties

const formColumnStyles = { padding: "0 20 0 30" }
const notesColumnStyles = { padding: "0 30 0 20" }

@inject("rootStore")
@observer
export class WorkDetail extends React.Component<any, any> {

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        return (
            <div style={wrapperStyle}>
                <div style={formColumnStyles}>
                    <div style={titleStlyes}>View Work</div>
                    <FormControlGroup
                        data={this.employeeStore.selectedWork}
                        formControls={this.employeeStore.selectedWorkFormControls}
                        onChange={this.employeeStore.updateSelectedWork}
                        validation={{}}
                        width={350}
                    />
                </div>
                <div style={notesColumnStyles}>
                    <NotesBox
                        title="Work Notes"
                        notes={this.employeeStore.selectedWorkNotes}
                        onAddNote={() => null}
                        displayCount={this.employeeStore.selectedWorkNotesDisplayCount}
                    />
                </div>
            </div>
        )
    }
}