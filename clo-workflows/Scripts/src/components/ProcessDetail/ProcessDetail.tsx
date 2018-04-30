import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../../store/"
import { FormControlGroup, WorkDetail, ProjectDetail } from "../"
import { autobind } from "core-decorators"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { Pivot, PivotLinkFormat, PivotItem, PivotLinkSize } from "office-ui-fabric-react/lib/Pivot"
import { PivotState } from "../../store/EmployeeStore/RequestDetailStore"
import "./styles.css"

@inject("rootStore")
@autobind
@observer
export default class ProcessDetail extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div className="processDetail-wrapper-styles">
                <div className="processDetail-processFor-styles">
                    {/* Process Form */}
                    <div className="processDetail-processTitle-styles">Edit Process</div>
                    <FormControlGroup
                        data={requestDetailStore.process}
                        formControls={requestDetailStore.processView.formControls}
                        validation={requestDetailStore.processValidation}
                        updateFormField={requestDetailStore.updateProcess}
                        width={350}
                        getFormControlDescription={requestDetailStore.getProcessSubmissionMetadata}
                    />
                    <div className="processDetail-submitButton-styles">
                        <PrimaryButton
                            text="Submit to Next Step"
                            onClick={requestDetailStore.submitProcess}
                            disabled={!requestDetailStore.canSubmitProcess}
                        />
                    </div>
                </div>
                <div className="processDetail-projectWorkSwitches-styles">
                    {/* Project / Work switcher */}
                    <Pivot
                        linkFormat={PivotLinkFormat.tabs}
                        linkSize={PivotLinkSize.large}
                        selectedKey={requestDetailStore.pivotState}
                        onLinkClick={item => requestDetailStore.setPivotState(item.props.itemKey as PivotState)}
                    >
                        <PivotItem linkText="Work" itemKey="work">
                            <WorkDetail />
                        </PivotItem>
                        <PivotItem linkText="Project" itemKey="project">
                            <ProjectDetail />
                        </PivotItem>
                    </Pivot>
                </div>
            </div>
        )
    }
}
