import * as React from "react"
import { IUser } from "../model/User"
import { inject, observer } from "mobx-react"
import { EmployeeStore, EmployeeViewKey } from "../store/EmployeeStore"
import { SessionStore } from "../store/SessionStore"
import FormControlGroup from "./FormControlGroup"
import { observable } from "mobx"
import { IStep } from "../model/Step"
import { autobind } from "core-decorators"
import { NonScrollableList } from "./NonScrollableList"
import { RoleSteps } from "./RoleSteps"
import { Breadcrumb } from "office-ui-fabric-react/lib/Breadcrumb"
import { Button } from "office-ui-fabric-react/lib/Button"
import { HeaderBreadcrumb } from "./HeaderBreadcrumb";

const wrapperStyles = {
    marginLeft: 25,
}

@inject("rootStore")
@autobind
@observer
export class Employee extends React.Component<any, any> {

    public componentWillMount() {
        this.sessionStore = this.props.rootStore.sessionStore
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private sessionStore: SessionStore
    private employeeStore: EmployeeStore

    public render() {
        const { sessionStore, employeeStore} = this
        return (
            <div style={wrapperStyles}>
                <HeaderBreadcrumb items={employeeStore.breadcrumbItems} onClickItem={employeeStore.reduceViewHierarchy} />
                {
                    /* Employee Dashboard */
                    employeeStore.currentView === EmployeeViewKey.Dashboard &&
                    <div>
                        <RoleSteps />
                        {
                            employeeStore.selectedStep &&
                            <NonScrollableList items={employeeStore.processBriefsForSelectedStep} title={employeeStore.selectedStep} onClickItem={employeeStore.selectProcess} />
                        }
                    </div>
                }
                {
                    /* Process Detail */
                    employeeStore.currentView === EmployeeViewKey.ProcessDetail &&
                    <div>
                        <FormControlGroup data={employeeStore.selectedProcess} formControls={employeeStore.selectedProjectFormControls}
                            validation={{}} onChange={employeeStore.updateSelectedProject} />
                    </div>
                }
            </div>
        )
    }
}
