import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import { NonScrollableList } from "./NonScrollableList"
import { RoleSteps } from "./RoleSteps"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { SearchBox } from "office-ui-fabric-react"

const wrapperStyle = {
    margin: "80px 32px 80px 32px",
    background: "#F8F8F8",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    padding: "20px",
    width: "500px"
}
const textStyle = {
    font: "20px Segoe UI, sans-serif",
    color: "#202020",
    fontWeight: 200,
    textAlign: "center",
    marginTop: "20px"
} as React.CSSProperties

const processListTitleStyles = {
    textAlign: "center",
    font: "26px Segoe UI, sans-serif",
    marginBottom: "8px",
}

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
                {employeeStore.isFocusSelectedStep && (
                    <div style={wrapperStyle}>
                        <div style={processListTitleStyles}>{`${employeeStore.selectedStep.name} Active Processes`}</div>
                        {employeeStore.selectedStepProcessBriefs && employeeStore.selectedStepProcessBriefs.length ? (
                            <NonScrollableList
                                items={employeeStore.selectedStepProcessBriefs}
                                onSelectItem={employeeStore.selectProcess}
                            />
                        ) : (
                            <div style={textStyle}>No Active Processes</div>
                        )}
                    </div>
                )}
                {employeeStore.isFocusSearch && (
                    <div style={wrapperStyle}>
                        <div style={processListTitleStyles}>{`Process Search Results`}</div>
                        {employeeStore.searchedProcessBriefs && employeeStore.searchedProcessBriefs.length ? (
                            <NonScrollableList
                                items={employeeStore.searchedProcessBriefs}
                                onSelectItem={employeeStore.selectProcess}
                            />
                        ) : (
                            <div style={textStyle}>no processes found</div>
                        )}
                    </div>
                )}
            </div>
        )
    }
}
