import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import NotesBox from "./NotesBox";

interface IWorkDetailState {
    isWorkExpanded: boolean
}

const wrapperStyle = {
    background: "#F8F8F8",
    width: "100%",
    padding: "20 0",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start"
} as React.CSSProperties

@inject("rootStore")
@observer
export class WorkDetail extends React.Component<any,  IWorkDetailState> {

    constructor(props) {
        super(props)
        this.state = { isWorkExpanded: false }
    }

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        return (
            <div onClick={() => this.setState({isWorkExpanded: !this.state.isWorkExpanded})} style={wrapperStyle}>
            { 
                this.state.isWorkExpanded
                ? (
                    <div style={/*{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start"}*/{width: "60%"}}>
                        <FormControlGroup
                            data={this.employeeStore.selectedWork}
                            formControls={this.employeeStore.selectedWorkFormControls}
                            onChange={this.employeeStore.updateSelectedWork}
                            validation={{}}
                            width={350}
                        />
                        {/* <NotesBox
                            title="Work Notes"
                            notes={this.employeeStore.selectedWorkNotes}
                            onAddNote={() => null}
                        /> */}
                    </div>
                ) : (
                    <div style={{width: "60%"}}>
                        <div><strong>Work Name</strong></div>
                        <div>click to expand</div>
                    </div>
                )
            }
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