import * as React from "react"
import { IUser } from "../model/User"
import { inject, observer } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import { SessionStore } from "../store/SessionStore"
import FormControlGroup from "./FormControlGroup"
import { observable } from "mobx"
import { IStep } from "../model/Step"
import { CompoundButton, IButtonProps } from "office-ui-fabric-react/lib/Button"

const wrapperStyles = {
    marginLeft: 25,
}

const stepButtonWrapperStyles = {
    height: 40,
    maxWidth: "95%",
    margin: "auto",
}

const stepButtonStyles = {
    margin: "10 10 0 0",
}

@inject("rootStore")
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
                <h1>{`${sessionStore.currentUser.role.name} Pending Items`}</h1>
                <div style={stepButtonWrapperStyles}>
                {
                    sessionStore.currentUser.role.permittedSteps.map((step: IStep, index: number) => {
                        const pendingItemCount = employeeStore.pendingProcessesByStep[step.name] ? employeeStore.pendingProcessesByStep[step.name] : 0
                        return (
                            <CompoundButton key={index} style={stepButtonStyles} description={`${pendingItemCount} Pending Items`} primary={!!pendingItemCount}>
                                {step.name}
                            </CompoundButton>
                        )
                    })
                }
                </div>
            </div>
        )
    }

}
