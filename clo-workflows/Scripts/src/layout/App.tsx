import * as React from "react"
import { inject, observer } from "mobx-react"
import { UserStore } from "../store/UserStore"
import { Fabric } from "office-ui-fabric-react/lib/Fabric"
import Greeting from "../component/Greeting"
import RoleChecker from "../component/RoleChecker";
import DevTools from 'mobx-react-devtools'
import { initializeIcons } from '@uifabric/icons';

// Register icons and pull the fonts from the default SharePoint cdn.
initializeIcons();
@inject("rootStore")
@observer
export class App extends React.Component<any, any> {

    componentWillMount() {
        this.userStore = this.props.rootStore.userStore
    }

    private userStore: UserStore

    render() {
        return (
            <Fabric>
                <RoleChecker role={"Anonymous"} currentUser={this.userStore.currentUser}/>
                <DevTools />

            </Fabric>
        )
    }
}
