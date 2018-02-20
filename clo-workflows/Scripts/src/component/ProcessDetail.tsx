import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import FormControlGroup from "./FormControlGroup"
import { autobind } from "core-decorators"
import { WorkDetail } from "./WorkDetail"
import { ProjectDetail } from "./ProjectDetail"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Pivot, PivotLinkFormat, PivotItem, PivotLinkSize } from "office-ui-fabric-react/lib/Pivot"


const wrapperStyles = {
    margin: "30 0",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
} as React.CSSProperties

const submitButtonStlyes = {
    display: "flex",
    justifyContent: "center",
    marginTop: 30
} as React.CSSProperties

const processTitleStyles = {
    textAlign: "center",
    marginBottom: "10",
    font: "30px Segoe UI, sans-serif",
} as React.CSSProperties

const processFormStyle = {
    background: "#F8F8F8",
    padding: "20 25",
    marginTop: 40,
    marginRight: 35,
}

const projectWorkSwitcherStyle = {
    marginLeft: 35
}


@inject("rootStore")
@autobind
@observer
export class ProcessDetail extends React.Component<any, any> {

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
                        width={350}
                    />
                    <div style={submitButtonStlyes}>
                        <PrimaryButton text="Submit Changes"
                            onClick={this.employeeStore.submitSelectedProcess}
                            disabled={this.employeeStore.canSubmitSelectedProcess}
                        />
                    </div>
                </div>
                <div style={projectWorkSwitcherStyle}>
                    {/* Project / Work switcher */}
                    <Pivot linkFormat={PivotLinkFormat.tabs} linkSize={PivotLinkSize.large}>
                        <PivotItem linkText="Work">
                            <WorkDetail />
                        </PivotItem>
                        <PivotItem linkText="Project">
                            <ProjectDetail />
                        </PivotItem>
                    </Pivot>
                </div>

            </div>
        )
    }
}
