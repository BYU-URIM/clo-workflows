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
    marginBottom: "20",
    font: "35px Segoe UI, sans-serif",
    width: 350
} as React.CSSProperties

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
                <div>
                    <div style={titleStlyes}>View Project</div>
                    <FormControlGroup
                        data={this.employeeStore.selectedProject}
                        formControls={this.employeeStore.selectedProjectFormControls}
                        onChange={this.employeeStore.updateSelectedProject}
                        validation={{}}
                        width={400}
                    />
                </div>
                <div>
                    <NotesBox
                        title="Project Notes"
                        notes={this.employeeStore.selectedProjectNotes}
                        onAddNote={() => null}
                        displayCount={2}
                    />
                </div>
            </div>
        )
    }
}