import * as React from "react"
import { IUser } from "../model/User"
import { inject, observer } from "mobx-react"
import { EmployeeProcessStore } from "../store/EmployeeProcessStore"
import { UiStore } from "../store/UiStore"
import { UserStore } from "../store/UserStore"
import FormControlGroup from "./FormControlGroup"
import { observable } from "mobx"

const styles = {
  border: "solid 2px black",
  margin: "25px",
  padding: "10px",
}

@inject("rootStore")
@observer
export class Employee extends React.Component<any, any> {

    public componentWillMount() {
        this.userStore = this.props.rootStore.userStore
        this.uiStore = this.props.rootStore.uiStore
        this.employeeProcessStore = this.props.rootStore.employeeProcessStore
    }

    private userStore: UserStore
    private uiStore: UiStore
    private employeeProcessStore: EmployeeProcessStore

    public render() {
        return (
            <div>
                <h2>Test Project Form</h2>
                <FormControlGroup data={this.employeeProcessStore.currentProject} formControls={this.uiStore.projectFormControls.get("Movies")}
                    validation={{}} onChange={this.employeeProcessStore.updateCurrentProject} />
            </div>
        )
    }

}
