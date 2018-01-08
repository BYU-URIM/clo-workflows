import * as React from "react"
import { inject, observer } from "mobx-react"

import { IUser } from "../model/User"
import Header from "./Header";
import FormControlGroup from "./FormControlGroup";
import {UiStore} from "../store/UiStore";
import {UserStore} from "../store/UserStore";
import {ClientProcessStore} from "../store/ClientProcessStore";
import {Dropdown} from "office-ui-fabric-react/lib/Dropdown";

interface IAnonymousProps {
  currentUser: IUser
  uiStore: UiStore
}
@inject("rootStore")
@observer
export class Anonymous extends  React.Component<any, any> {
  public componentWillMount() {
    this.userStore = this.props.rootStore.userStore
    this.uiStore = this.props.rootStore.uiStore
    this.clientProcessStore = this.props.rootStore.clientProcessStore
}
 userStore:UserStore
 uiStore:UiStore
 clientProcessStore:ClientProcessStore

  render() {
    console.log(this.clientProcessStore.currentProject)
    const {currentProject} = this.clientProcessStore
    const x = currentProject.get("type")
    console.log(x)
    return (
      <div>
        <Dropdown
          
        />        
        <FormControlGroup
          data={this.clientProcessStore.currentProject} 
          formControls={this.uiStore.projectFormControls.get(x as string)}
          validation={{}} 
          onChange={this.clientProcessStore.updateCurrentProject}
        />
      </div>
    )
  }
}
