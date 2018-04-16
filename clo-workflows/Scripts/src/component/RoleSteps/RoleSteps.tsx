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
    margin: "10px 10px 0 0",
    height: 50
} as React.CSSProperties
const stepButtonRowStyles = {
    maxWidth: "95%",
    margin: "auto",
}
const roleTitleStyles = {
    font: "24px Segoe UI, sans-serif",
    marginTop: "20px"
}

@inject("rootStore")
@autobind
@observer
export default class RoleSteps extends React.Component<any, any> {
    public componentWillMount() {
        this.sessionStore = this.props.rootStore.sessionStore
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private sessionStore: SessionStore
    private employeeStore: EmployeeStore

    private onStepButtonClick(step: IStep): void {
        this.employeeStore.selectFocusStep(step)
    }

    public render() {
        const { sessionStore, employeeStore } = this
        return (
            <div style={wrapperStyles}>
                <div style={stepButtonRowStyles}>
                    {
                        // first map each role to a new role row
                        sessionStore.currentUser.roles.map((role, index) => (
                            <div key={index}>
                                <div style={roleTitleStyles}>{`${role.name} Steps`}</div>
                                {
                                    // within each role row, map each permitted step to a step button
                                    role.permittedSteps.map((step: IStep, innerIndex: number) => {
                                        const pendingItemCount = employeeStore.processCountsByStep[step.name]
                                            ? employeeStore.processCountsByStep[step.name]
                                            : 0
                                        return (
                                            <CompoundButton
                                                onClick={() => this.onStepButtonClick(step)}
                                                key={innerIndex}
                                                style={stepButtonStyles}
                                                description={`${pendingItemCount} Pending Item${pendingItemCount !== 1 ? "s" : ""}`}
                                                primary={!!pendingItemCount}
                                                text={step.name}
                                                checked={employeeStore.focusStep && step.name === employeeStore.focusStep.name}
                                            />
                                        )
                                    })
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}
