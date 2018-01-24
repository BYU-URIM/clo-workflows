import * as React from "react"
import { inject, observer } from "mobx-react"
import { SessionStore } from "../store/SessionStore"
import { Fabric } from "office-ui-fabric-react/lib/Fabric"
import { Client } from "../component/Client"
import DevTools from "mobx-react-devtools"
import { initializeIcons } from "@uifabric/icons"
import Header, { IHeaderProps } from "../component/Header"
import { Employee } from "../component/Employee"


const backgroundStyles = {
} as React.CSSProperties

// app content refers to everything in the app below the header
const appContentStyles = {
    width: "80%",
    margin: "0 auto",
    background: "white",
    paddingTop: 20,
} as React.CSSProperties

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
                <div style={backgroundStyles}>
                    <div style={appContentStyles}>
                        {this.sessionStore.isEmployee ? (
                        <Employee currentUser={this.sessionStore.currentUser} />
                        ) : (
                        <Client currentUser={this.sessionStore.currentUser} />
                        )}
                    </div>
                </div>
                <DevTools />
            </Fabric>
        )
    }
}
