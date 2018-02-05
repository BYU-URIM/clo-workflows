import * as React from "react"
import { IUser } from "../model/User"
import { inject, observer } from "mobx-react"
import { EmployeeStore, EmployeeViewKey } from "../store/EmployeeStore"
import FormControlGroup from "./FormControlGroup"
import { observable } from "mobx"
import { IStep } from "../model/Step"
import { autobind } from "core-decorators"
import { EmployeeDashboard } from "./EmployeeDashboard"
import { HeaderBreadcrumb } from "./HeaderBreadcrumb"
import { ProcessDetail } from "./ProcessDetail"

const wrapperStyles = {
    marginLeft: 25,
}

@inject("rootStore")
@autobind
@observer
export class Employee extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const { employeeStore } = this
        return (
            <div style={wrapperStyles}>
                <HeaderBreadcrumb 
                    items={employeeStore.breadcrumbItems} 
                    onClickItem={employeeStore.reduceViewHierarchy} 
                    />
                {employeeStore.currentView === EmployeeViewKey.Dashboard && <EmployeeDashboard />}
                {/* Process Detail */
                employeeStore.currentView === EmployeeViewKey.ProcessDetail && <ProcessDetail />}
            </div>
        )
    }
}
