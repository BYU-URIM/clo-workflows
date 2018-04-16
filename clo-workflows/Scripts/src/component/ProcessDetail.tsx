import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore/EmployeeStore"
import FormControlGroup from "./FormControlGroup"
import { autobind } from "core-decorators"
import { WorkDetail } from "./WorkDetail"
import { ProjectDetail } from "./ProjectDetail"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Pivot, PivotLinkFormat, PivotItem, PivotLinkSize } from "office-ui-fabric-react/lib/Pivot"
import { PivotState } from "../store/EmployeeStore/RequestDetailStore"

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
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
}

const projectWorkSwitcherStyle = { marginLeft: 35 }


@inject("rootStore")
@autobind
@observer
export class ProcessDetail extends React.Component<any, any> {

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div style={wrapperStyles}>
                <div style={processFormStyle}>
                    {/* Process Form */}
                    <div style={processTitleStyles}>Edit Process</div>
                    <FormControlGroup
                        data={requestDetailStore.process}
                        formControls={requestDetailStore.processView.formControls}
                        validation={requestDetailStore.processValidation}
                        updateFormField={requestDetailStore.updateProcess}
                        width={350}
                        getFormControlDescription={requestDetailStore.getProcessSubmissionMetadata}
                    />
                    <div style={submitButtonStlyes}>
                        <PrimaryButton text="Submit to Next Step"
                            onClick={requestDetailStore.submitProcess}
                            disabled={!requestDetailStore.canSubmitProcess}
                        />
                    </div>
                </div>
                <div style={projectWorkSwitcherStyle}>
                    {/* Project / Work switcher */}
                    <Pivot
                        linkFormat={PivotLinkFormat.tabs}
                        linkSize={PivotLinkSize.large}
                        selectedKey={requestDetailStore.pivotState}
                        onLinkClick={(item) => requestDetailStore.setPivotState(item.props.itemKey as PivotState)}
                    >
                        <PivotItem
                            linkText="Work"
                            itemKey="work"
                        >
                            <WorkDetail />
                        </PivotItem>
                        <PivotItem
                            linkText="Project"
                            itemKey="project"
                        >
                            <ProjectDetail />
                        </PivotItem>
                    </Pivot>
                </div>

            </div>
        )
    }
}
