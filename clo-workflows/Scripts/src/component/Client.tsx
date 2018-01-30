import * as React from "react"
import { inject, observer } from "mobx-react"
import { IUser } from "../model/User"
import Header from "./Header"
import { SessionStore } from "../store/SessionStore"
import { ClientStore } from "../store/ClientStore"
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
// import { ClientWorkType } from "./ClientWorkType"
import { ClientProjectType } from "./ClientProjectType"
import { Label } from "office-ui-fabric-react/lib/Label"
import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from "office-ui-fabric-react/lib/Pivot"
import { ChoiceGroup, IChoiceGroupOption } from "office-ui-fabric-react/lib/ChoiceGroup"
import { Toggle } from "office-ui-fabric-react/lib/Toggle"
import { PrimaryButton } from "office-ui-fabric-react/lib/Button"
import { ClientWorkType } from "./ClientWorkType"
export interface IWorkTypeDropdownProps {
  workTypes: Array<string>
  setNewProjectState: any
}
const styles = {
  main: {
    display: "inline-block",
    maxWidth: "450px",
    margin: "10px",
  },
  item: {
    margin: "10px 0px",
  },
  content: {
    margin: "15px 0px",
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
    const { newProject, viewState } = clientStore
    const ops = [
      {
        key: "new",
        text: "New Project",
      },
      {
        key: "existing",
        text: "Exisitng Project",
      },
    ]

    return (
      <div style={styles.main}>
        <Pivot linkSize={PivotLinkSize.large} linkFormat={PivotLinkFormat.tabs}>
          <PivotItem linkText="New Request">
            <div style={styles.content}>
              {!clientStore.getViewState.newRequestVisible ? (
                <PrimaryButton text="Start New Request" primary onClick={() => clientStore.updateMember("startNewRequest")} />
              ) : (
                <PrimaryButton text="Cancel Request" primary onClick={() => clientStore.clear()} />
              )}
              {clientStore.startNewRequest && (
                <ChoiceGroup
                  selectedKey={clientStore.newOrExisting}
                  options={ops}
                  onChange={(event, selected) => clientStore.updateMember("newOrExisting", selected.key)}
                  label="Will your request be a part of a new or existing project?"
                />
              )}
              {clientStore.getViewState.newOrExisting === "new" && (
                <div>
                  <ClientProjectType clientStore={this.clientStore} />
                </div>
              )}
              {clientStore.getViewState.newOrExisting === "existing" && <SearchBox onFocus={() => console.log("onFocus called")} onBlur={() => console.log("onBlur called")} style={styles.item} />}
              {clientStore.newOrExisting === "existing" && <div>existing</div>}
              {clientStore.getViewState.selectedProjectType && (
                <ChoiceGroup
                  selectedKey={clientStore.newOrExisting}
                  options={ops}
                  onChange={(event, selected) => clientStore.updateMember("newOrExisting", selected.key)}
                  label="Will your request be a part of a new or existing project?"
                />
              )}
            </div>
          </PivotItem>
          <PivotItem linkText="Pending Requests">
            <Label>Pivot #2</Label>
            <ClientWorkType clientStore={this.clientStore} styles={styles} />
          </PivotItem>
          <PivotItem linkText="Completed Requests">
            <Label>Pivot #2</Label>
          </PivotItem>
        </Pivot>
      </div>
    )
  }
}
