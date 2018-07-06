import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore, PivotState } from "../../store/"
import { FormControlGroup, WorkDetail, ProjectDetail, DescriptiveDropdown } from "../"
// import { autobind } from "core-decorators"
import { PrimaryButton, Pivot, PivotLinkFormat, PivotItem, PivotLinkSize, IDropdownOption, SearchBox } from "office-ui-fabric-react/lib/"
import { StepName, getStepNames } from "../../model/"
import "./styles.scss"

@inject("rootStore")
// @autobind
@observer
export class ProcessDetail extends React.Component<any, any> {
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
                        formFields={requestDetailStore.processView.formFields}
                        validation={requestDetailStore.processValidation}
                        updateFormField={requestDetailStore.updateProcess}
                        width={350}
                        getFormControlDescription={requestDetailStore.getProcessSubmissionMetadata}
                    />
                    <DescriptiveDropdown
                        options={getStepNames().map(choice => ({ key: choice, text: choice }))}
                        selectedKey={requestDetailStore.nextStepName}
                        onChanged={(option: IDropdownOption) => requestDetailStore.updateNextStepName(option.text as StepName)}
                        label={"Next Process Step"}
                        disabled={!this.employeeStore.root.sessionStore.isAdmin}
                        description={
                            this.employeeStore.root.sessionStore.isAdmin && "as an administrator, you can override the calculated next process step"
                        }
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
