import * as React from "react"
import { inject, observer } from "mobx-react"
import { EmployeeStore, EmployeeViewKey } from "../../store/"
import { observable } from "mobx"
import { IStep } from "../../model/"
import { autobind } from "core-decorators"
import { EmployeeDashboard, HeaderBreadcrumb, ProcessDetail, Message } from "../"

import "./styles.css"

@inject("rootStore")
@autobind
@observer
export default class Employee extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const { employeeStore } = this
        return (
            <div
                className="employee-wrapper-styles"
            >
                <HeaderBreadcrumb items={employeeStore.breadcrumbItems} onClickItem={employeeStore.reduceViewHierarchy} />
                {employeeStore.currentView === EmployeeViewKey.Dashboard && <EmployeeDashboard />}
                {employeeStore.currentView === EmployeeViewKey.ProcessDetail && <ProcessDetail />}
                {employeeStore.message && <Message {...employeeStore.message} />}
            </div>
        )
    }
}
