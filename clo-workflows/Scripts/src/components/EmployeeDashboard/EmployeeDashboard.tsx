import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../../store/"
import { NonScrollableList, RoleSteps, ProcessBriefList } from "../"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { SearchBox } from "office-ui-fabric-react"
import "./styles.scss"

@inject("rootStore")
@observer
export default class EmployeeDashboard extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const { employeeStore } = this
        return (
            <div className={"employeeDashboard-wrapper"}>
                <div className={"employeeDashboard-roles-search"}>
                    <RoleSteps />
                    <div className="searchProcess-styles">
                        <div className="searchProcess-title-styles">Search Past Processes</div>
                        <div className="searchProcess-searchbox-styles">
                            <SearchBox placeholder="search by work or project" onSearch={employeeStore.searchProcesses} />
                        </div>
                    </div>
                </div>
                <div>
                    {employeeStore.isFocusStep && (
                        <ProcessBriefList
                            processBriefs={employeeStore.selectedStepProcessBriefs}
                            title={`${employeeStore.focusStep.name} Active Processes`}
                            emptyMessage="no active processes"
                            onSelectProcessBrief={employeeStore.selectActiveDetailProcess}
                        />
                    )}
                    {employeeStore.isFocusSearch && (
                        <ProcessBriefList
                            processBriefs={employeeStore.searchedProcessBriefs}
                            title="Search Results"
                            emptyMessage="no processes found"
                            onSelectProcessBrief={employeeStore.selectSearchedDetailProcess}
                        />
                    )}
                    {!employeeStore.isFocusSearch && !employeeStore.isFocusStep && (
                        <ProcessBriefList
                            title="No Step Selected"
                            emptyMessage="selec a step to view active processes"
                            processBriefs={[]}
                            onSelectProcessBrief={()=>null}
                        />
                    )}
                </div>
            </div>
        )
    }
}
