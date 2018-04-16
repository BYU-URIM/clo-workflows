import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore/EmployeeStore"
import { NonScrollableList } from "./NonScrollableList"
import { RoleSteps } from "./RoleSteps"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { SearchBox } from "office-ui-fabric-react"
import ProcessBriefList from "./ProcessBriefList"

const searchProcessStyles = {
    maxWidth: "95%",
    margin: "auto",
}

const searchProcessTitleStyles = {
    font: "24px Segoe UI, sans-serif",
}

@inject("rootStore")
@observer
export class EmployeeDashboard extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const { employeeStore } = this
        return (
            <div>
                <RoleSteps />
                <div style={searchProcessStyles}>
                    <div style={searchProcessTitleStyles}>Search Past Processes</div>
                    <div style={{width: 300, marginTop: 10}}>
                        <SearchBox
                            placeholder="search by work or project"
                            onSearch={employeeStore.searchProcesses}
                        />
                    </div>
                </div>
                {employeeStore.isFocusStep &&
                    <ProcessBriefList
                        processBriefs={employeeStore.selectedStepProcessBriefs}
                        title={`${employeeStore.focusStep.name} Active Processes`}
                        emptyMessage="no active processes"
                        onSelectProcessBrief={employeeStore.selectActiveDetailProcess}
                    />
                }
                {employeeStore.isFocusSearch &&
                    <ProcessBriefList
                        processBriefs={employeeStore.searchedProcessBriefs}
                        title="Search Results"
                        emptyMessage="no processes found"
                        onSelectProcessBrief={employeeStore.selectSearchedDetailProcess}
                    />
                }
            </div>
        )
    }
}
