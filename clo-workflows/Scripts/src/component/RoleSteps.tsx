import * as React from "react"
import { SessionStore } from "../store/SessionStore"
import { inject } from "mobx-react"
import { observer } from "mobx-react"
import { autobind } from "core-decorators"
import { CompoundButton, IButtonProps } from "office-ui-fabric-react/lib/Button"
import { EmployeeStore } from "../store/EmployeeStore"
import { IStep } from "../model/Step"

const wrapperStyles = { marginBottom: 40 }
const stepButtonStyles = {
    margin: "10 10 0 0",
    height: 50,
}
const stepButtonRowStyles = {
    maxWidth: "95%",
    margin: "auto",
}

@inject("rootStore")
@autobind
@observer
export class RoleSteps extends React.Component<any, any> {
    public componentWillMount() {
        this.sessionStore = this.props.rootStore.sessionStore
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private sessionStore: SessionStore
    private employeeStore: EmployeeStore

    private onStepButtonClick(step: IStep): void {
        this.employeeStore.selectStep(step)
    }

    public render() {
        const { sessionStore, employeeStore } = this
        return (
            <div style={wrapperStyles}>
                <div style={stepButtonRowStyles} id="step button row">
                    {sessionStore.currentUser.role.permittedSteps.map((step: IStep, index: number) => {
                        const pendingItemCount = employeeStore.processCountsByStep[step.name]
                            ? employeeStore.processCountsByStep[step.name]
                            : 0
                        return (
                            <CompoundButton
                                onClick={() => this.onStepButtonClick(step)}
                                key={index}
                                style={stepButtonStyles}
                                description={`${pendingItemCount} Pending Items`}
                                primary={!!pendingItemCount}
                                text={step.name}
                                checked={employeeStore.selectedStep && step.name === employeeStore.selectedStep.name}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }
}
