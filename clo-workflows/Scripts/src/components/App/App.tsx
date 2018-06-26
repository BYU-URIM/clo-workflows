import * as React from "react"
import { inject, observer } from "mobx-react"
import { Header, Employee, LoadingPage, Client } from "../"
import { Fabric } from "office-ui-fabric-react/lib/"
import { initializeIcons } from "@uifabric/icons"
import "./styles.scss"

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons()
@inject("rootStore")
@observer
export class App extends React.Component<any, any> {
    render() {
        const { rootStore } = this.props
        return (
            <Fabric>
                {rootStore.initialized ? (
                    <>
                        <Header
                            currentUser={rootStore.sessionStore.currentUser}
                            clientMode={rootStore.sessionStore.isEmployee ? rootStore.employeeStore.clientMode : undefined}
                            toggleClientMode={rootStore.sessionStore.isEmployee ? rootStore.employeeStore.toggleClientMode : undefined}
                        />
                        <div className="app-content-styles">
                            {!rootStore.sessionStore.isEmployee || rootStore.employeeStore.clientMode ? (
                                <Client currentUser={rootStore.sessionStore.currentUser} />
                            ) : (
                                <Employee currentUser={rootStore.sessionStore.currentUser} />
                            )}
                        </div>
                    </>
                ) : (
                    <LoadingPage />
                )}
            </Fabric>
        )
    }
}
