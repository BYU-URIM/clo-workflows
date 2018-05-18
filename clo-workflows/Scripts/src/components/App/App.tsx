import * as React from "react"
import { inject, observer } from "mobx-react"
import { RootStore } from "../../store/"
import { Header, Employee, LoadingPage, Client } from "../"
import { Fabric } from "office-ui-fabric-react"
import "./styles.scss"
import { initializeIcons } from "@uifabric/icons"
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
                    /* data is initialized - render out app content (client / employee dashboard) */
                    <div>
                        <Header
                            currentUser={this.rootStore.sessionStore.currentUser}
                            clientMode={
                                this.rootStore.sessionStore.isEmployee
                                    ? this.rootStore.employeeStore.clientMode
                                    : undefined
                            }
                            toggleClientMode={
                                this.rootStore.sessionStore.isEmployee
                                    ? this.rootStore.employeeStore.toggleClientMode
                                    : undefined
                            }
                        />
                        <div>
                            <div className="app-content-styles">
                                {!this.rootStore.sessionStore.isEmployee || this.rootStore.employeeStore.clientMode ? (
                                    <Client currentUser={this.rootStore.sessionStore.currentUser} />
                                ) : (
                                    <Employee currentUser={this.rootStore.sessionStore.currentUser} />
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
