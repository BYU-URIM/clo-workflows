import * as React from "react"
import { inject, observer } from "mobx-react"
import { SessionStore, RootStore } from "../../store/"
import { Fabric } from "office-ui-fabric-react/lib/Fabric"
import DevTools from "mobx-react-devtools"
import { initializeIcons } from "@uifabric/icons"
import { Header, IHeaderProps, Employee, LoadingPage, Client } from "../"

const backgroundStyles = {} as React.CSSProperties

// app content refers to everything in the app below the header
const appContentStyles = {
    width: "85%",
    margin: "0 auto",
    background: "white",
    paddingTop: 20,
    paddingBottom: 60,
} as React.CSSProperties

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons()
@inject("rootStore")
@observer
export default class App extends React.Component<any, any> {
    componentWillMount() {
        this.rootStore = this.props.rootStore
    }

    private rootStore: RootStore

    render() {
        return (
            <Fabric>
                {this.rootStore.initialized ? (
                    /* data is initialized - render out app content (client / employee dashbpard) */
                    <div>
                        <Header
                            currentUser={this.rootStore.sessionStore.currentUser}
                            clientMode={this.rootStore.employeeStore.clientMode}
                            toggleClientMode={this.rootStore.employeeStore.toggleClientMode}
                        />
                        <div style={backgroundStyles}>
                            <div style={appContentStyles}>
                                {this.rootStore.sessionStore.isEmployee ? (
                                    <>
                                        {!this.rootStore.employeeStore.clientMode ? (
                                            <Employee currentUser={this.rootStore.sessionStore.currentUser} />
                                        ) : (
                                            <Client currentUser={this.rootStore.sessionStore.currentUser} />
                                        )}
                                    </>
                                ) : (
                                    <Client currentUser={this.rootStore.sessionStore.currentUser} />
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* data is unitialized - render out loading page */
                    <LoadingPage />
                )}
                {/* <DevTools /> */}
            </Fabric>
        )
    }
}
