import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import NotesBox from "./NotesBox"

const wrapperStyle = {
    background: "#F8F8F8",
    width: "100%",
    padding: "20 20",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
} as React.CSSProperties

const titleStlyes = {
    textAlign: "center",
    marginBottom: "20",
    font: "35px Segoe UI, sans-serif",
    width: 350
} as React.CSSProperties

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
                <div style={{width: "60%"}}>
                    <div style={titleStlyes}>View Work</div>
                    <FormControlGroup
                        data={this.employeeStore.selectedWork}
                        formControls={this.employeeStore.selectedWorkFormControls}
                        onChange={this.employeeStore.updateSelectedWork}
                        validation={{}}
                        width={400}
                    />
                </div>
                <div style={{width: "40%"}}>
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