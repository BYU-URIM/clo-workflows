import * as React from "react"
import { inject, observer } from "mobx-react"

import { IUser } from "../model/User"
import Header from "./Header"
import FormControlGroup from "./FormControlGroup"
import {SessionStore} from "../store/SessionStore"
import {ClientStore} from "../store/ClientStore"
import {Dropdown} from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import {
  Checkbox,
} from "office-ui-fabric-react/lib/Checkbox"
export interface IWorkTypeDropdownProps {
  workTypes: Array<string>
  setNewProjectState: any
}
const styles = {
  main: {
    maxWidth: "350px",
    margin:"10px",
    },
  item:{
   margin:"10px 0px",
  },
}

@inject("rootStore")
@observer
export class Anonymous extends React.Component<any, any> {
  public componentWillMount() {
    this.sessionStore = this.props.rootStore.sessionStore

    this.clientStore = this.props.rootStore.clientStore
  }
  sessionStore: SessionStore
  clientStore: ClientStore

  render() {
    const options = [{ key: "Header", text: "Work Types", itemType: Header }]
    const { newProject, newProjectState, DataService } = this.clientStore
    return (
      <div style={styles.main}>
        <Dropdown
          className="WorkTypeDropdownClass"
          label="Select the Project Type:"
          selectedKey={
            this.clientStore.newProjectState.projectType
              ? this.clientStore.newProjectState.projectType
              : undefined
          }
          options={Array.from(DataService().getProjectTypes()).map((field) => ({ text: field, value: field, key: field }))}
          placeHolder="Select an Option"
          onChanged={(e) => this.clientStore.updateNewProjectState("projectType", e.text)}
          style={styles.item}
        />
        {this.clientStore.newProjectState.projectType && (
          <div>
          <SearchBox onFocus={() => console.log("onFocus called")} onBlur={() => console.log("onBlur called")}
          style={styles.item}
          />
          <Checkbox
            label="Create new project"
            style={styles.item}
            />
          </div>
        )
        }
        {newProjectState.projectType && (
          <div>
            <Dropdown
                label="Select the Work Type:"
                selectedKey={
                  this.clientStore.newProjectState.workType
                    ? this.clientStore.newProjectState.workType
                    : undefined
                }
                options={
                  Array.from(DataService().getWorkTypes()).map((field) => (
                    {
                      text: field,
                      value: field,
                      key: field,
                    }
                  ))
                }
                placeHolder="Select an Option"
                onChanged={(e) => this.clientStore.updateNewProjectState("workType", e.text)}
                style={styles.item}
                />
            <Checkbox
                label="Create new project"
                style={styles.item}
                />
          </div>
        )}
        {this.clientStore.newProjectState.workType && (
          <SearchBox onFocus={() => console.log("onFocus called")} onBlur={() => console.log("onBlur called")} />
        )}
        {
          this.clientStore.newProjectState.workType &&
          <div style = {styles.item}>
          <FormControlGroup
            data={newProject}
            formControls={this.clientStore
              .DataService()
              .getProjectFormControlsForType(newProjectState.projectType)}
              validation={{}}
              onChange={this.clientStore.updateNewProject}
              />
              </div>
        }
      </div>
    )
  }
}
