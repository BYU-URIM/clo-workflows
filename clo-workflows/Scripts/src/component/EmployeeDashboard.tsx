import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import { NonScrollableList } from "./NonScrollableList"
import { RoleSteps } from "./RoleSteps"

const wrapperStyle = { margin: "0 32" }
const textStyle = {
    font: "20px Segoe UI, sans-serif",
    color: "#202020",
    fontWeight: 200,
} as React.CSSProperties

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
                {
                    employeeStore.selectedStep &&
                    <div style={wrapperStyle}>
                        <h2>{`${employeeStore.selectedStep} Active Processes`}</h2>
                        {
                            employeeStore.selectedStepProcessBriefs && employeeStore.selectedStepProcessBriefs.length
                            ? (
                                <NonScrollableList
                                    selectable
                                    items={employeeStore.selectedStepProcessBriefs}
                                    onClickItem={employeeStore.selectProcess}
                                />
                            ) : (
                                <div style={textStyle}>No Active Processes</div>
                            )
                        }

                    </div>
                }
            </div>
        )
    }
}
