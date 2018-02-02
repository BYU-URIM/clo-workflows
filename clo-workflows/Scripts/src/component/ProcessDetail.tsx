import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import FormControlGroup from "./FormControlGroup"
import { autobind } from "core-decorators"
import { WorkDetail } from "./WorkDetail"
import { ProjectDetail } from "./ProjectDetail";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";


const wrapperStyles = {
    margin: "40 0",
    marginBottom: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
} as React.CSSProperties

const submitButtonStlyes = {
    display: "flex",
    justifyContent: "center",
    marginTop: 30
} as React.CSSProperties

const processTitleStyles = {
    textAlign: "center",
    marginBottom: "20",
    font: "35px Segoe UI, sans-serif",
} as React.CSSProperties

const processFormStyle = {
    background: "#F8F8F8",
    padding: "20 25"
}

interface IProcessDetailState {
    isWorkExpanded: boolean
    isProjectExpanded: boolean
}


@inject("rootStore")
@autobind
@observer
export class ProcessDetail extends React.Component<any, IProcessDetailState> {

    constructor(props) {
        super(props)
        this.state = {
            isWorkExpanded: false,
            isProjectExpanded: false
        }
    }

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const { employeeStore } = this
        return (
            <div style={wrapperStyles}>
                <div style={processFormStyle}>
                    {/* Process Form */}
                    <div style={processTitleStyles}>Edit Process</div>
                    <FormControlGroup
                        data={employeeStore.selectedProcess}
                        formControls={employeeStore.selectedProcessFormControls}
                        validation={employeeStore.selectedProcessValidation}
                        onChange={employeeStore.updateSelectedProcess}
                        width={400}
                    />
                    <div style={submitButtonStlyes}>
                        <PrimaryButton text="Submit Changes" onClick={() => null} />
                    </div>
                </div>
                <div style={{width: "60%"}}>
                    {/* Expandable work form and work notes */}
                    <WorkDetail />

                    {/* Expandable project form and project notes */}
                    <ProjectDetail />
                </div>

            </div>
        )
    }
}
