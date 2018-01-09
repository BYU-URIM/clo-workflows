import * as React from "react"
import { inject, observer } from "mobx-react"
import { SessionStore } from "../store/SessionStore"
import { Fabric } from "office-ui-fabric-react/lib/Fabric"
import { Anonymous } from "../component/Client"
import DevTools from "mobx-react-devtools"
import { initializeIcons } from "@uifabric/icons"
import Header from "../component/Header"
import { Employee } from "../component/Employee"

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons()
@inject("rootStore")
@observer
export class App extends React.Component<any, any> {
  componentWillMount() {
    this.sessionStore = this.props.rootStore.sessionStore
  }

  private sessionStore: SessionStore

  render() {
    return (
      <Fabric>
        <Header currentUser={this.sessionStore.currentUser} />
        {this.sessionStore.isEmployee ? (
          <Employee currentUser={this.sessionStore.currentUser} />
        ) : (
          <Anonymous currentUser={this.sessionStore.currentUser} />
        )}
        <DevTools />
      </Fabric>
    )
  }
}
