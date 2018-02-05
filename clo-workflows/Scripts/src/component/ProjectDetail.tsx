import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import NotesBox from "./NotesBox"

interface IWorkDetailState {
    isProjectExpanded: boolean
}

@inject("rootStore")
@observer
export class ProjectDetail extends React.Component<any,  IWorkDetailState> {

    constructor(props) {
        super(props)
        this.state = { isProjectExpanded: false }
    }

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        return (
            <div onClick={() => this.setState({isProjectExpanded: !this.state.isProjectExpanded})} style={{background: "#F8F8F8", width: "100%", padding: "20 0", textAlign: "center"}}>
            { 
                this.state.isProjectExpanded
                ? (
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start"}}>
                        <FormControlGroup
                            data={this.employeeStore.selectedProject}
                            formControls={this.employeeStore.selectedProjectFormControls}
                            onChange={this.employeeStore.updateSelectedProject}
                            validation={{}}
                            width={350}
                        />
                        <NotesBox
                            title="Project Notes"
                            notes={this.employeeStore.selectedProjectNotes}
                            onAddNote={() => null}
                            displayCount={0}
                        />
                    </div>
                ) : (
                    <div>
                        <div><strong>Project Name</strong></div>
                        <div>click to expand</div>
                    </div>
                )
            }
        </div>
        )
    }
}