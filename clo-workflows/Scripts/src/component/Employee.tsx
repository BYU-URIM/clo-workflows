import * as React from "react"
import { IUser } from "../model/User"
import { inject, observer } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import { SessionStore } from "../store/SessionStore"
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
        this.sessionStore = this.props.rootStore.sessionStore
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private sessionStore: SessionStore
    private employeeStore: EmployeeStore
    
    public render() {
        const { sessionStore, employeeStore} = this 
        return (
            <div>
                <h2>Test Project Form</h2>
                <FormControlGroup 
                    data={employeeStore.currentProject} 
                    formControls={this.employeeStore.getDataService().getProjectFormControls().get("Movies")}
                    validation={{}} 
                    onChange={employeeStore.updateCurrentProject} />
            </div>
        )
    }

}
