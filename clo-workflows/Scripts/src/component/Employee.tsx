import * as React from "react"
import { IUser } from "../model/User"
import { inject, observer } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import { SessionStore } from "../store/SessionStore"
import FormControlGroup from "./FormControlGroup"
import { observable } from "mobx"
import { IStep } from "../model/Step"
import { CompoundButton, IButtonProps } from "office-ui-fabric-react/lib/Button"
import { autobind } from "core-decorators"
import { List } from "office-ui-fabric-react/lib/List";

const wrapperStyles = {
    marginLeft: 25,
}

const subheaderStyles = {
    marginTop: 50,
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
@autobind
@observer
export class Employee extends React.Component<any, any> {

    public componentWillMount() {
        this.sessionStore = this.props.rootStore.sessionStore
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private sessionStore: SessionStore
    private employeeStore: EmployeeStore

    private onStepButtonClick(step: string): void {
        this.employeeStore.selectStep(step)
    }

    public render() {
        const { sessionStore, employeeStore} = this
        return (
            <div style={wrapperStyles}>
                <h1>{`${sessionStore.currentUser.role.name} Active Processes`}</h1>
                <div style={stepButtonWrapperStyles}>
                {
                    sessionStore.currentUser.role.permittedSteps.map((step: IStep, index: number) => {
                        const pendingItemCount = employeeStore.processCountsByStep[step.name] ? employeeStore.processCountsByStep[step.name] : 0
                        return (
                            <CompoundButton onClick={() => this.onStepButtonClick(step.name)} key={index} style={stepButtonStyles} description={`${pendingItemCount} Pending Items`}
                                primary={!!pendingItemCount} text={step.name} checked={step.name === employeeStore.selectedStep} />
                        )
                    })
                }
                {
                    employeeStore.selectedStep &&
                    (
                        <div style={subheaderStyles}>
                            <h2>{`${employeeStore.selectedStep} Processes`}</h2>
                            <List items={employeeStore.processesForSelectedStep} onRenderCell={this.onRenderCell} />
                        </div>
                    )
                }
                </div>
            </div>
        )
    }

    private onRenderCell(item, index) {
        return (
            <div>{item.id}</div>
        )
    }

}
