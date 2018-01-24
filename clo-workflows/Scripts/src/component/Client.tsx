import * as React from "react"
import { inject, observer } from "mobx-react"
import { IUser } from "../model/User"
import Header from "./Header"
import FormControlGroup from "./FormControlGroup"
import { SessionStore } from "../store/SessionStore"
import { ClientStore } from "../store/ClientStore"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
import { ClientWorkType } from "./ClientWorkType"
import { ClientProjectType } from "./ClientProjectType"
import { Label } from "office-ui-fabric-react/lib/Label"
import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from "office-ui-fabric-react/lib/Pivot"
export interface IWorkTypeDropdownProps {
  workTypes: Array<string>
  setNewProjectState: any
}
const styles = {
  main: {
    maxWidth: "350px",
    margin: "10px",
  },
  item: {
    margin: "10px 0px",
  },
}

@inject("rootStore")
@observer
export class Client extends React.Component<any, any> {
  public componentWillMount() {
    this.sessionStore = this.props.rootStore.sessionStore
    this.clientStore = this.props.rootStore.clientStore
  }
  sessionStore: SessionStore
  clientStore: ClientStore

  render() {
    const options = [{ key: "Header", text: "Work Types", itemType: Header }]
    const { sessionStore, clientStore } = this
    const { newProject, newProjectState, DataService } = clientStore
    return (
      <div style={styles.main}>
        <Pivot linkSize={PivotLinkSize.large} linkFormat={PivotLinkFormat.tabs}>
          <PivotItem linkText="New Request">
            <Label>Welcome {sessionStore.currentUser.name.split(" ")[0]}!</Label>
            <ClientProjectType clientStore={this.clientStore} styles={styles} />
            <ClientWorkType clientStore={this.clientStore} styles={styles} />
          </PivotItem>
          <PivotItem linkText="Pending Requests">
            <Label>Pivot #2</Label>
          </PivotItem>
          <PivotItem linkText="Completed Requests">
            <Label>Pivot #2</Label>
          </PivotItem>
        </Pivot>
      </div>
    )
  }
}
