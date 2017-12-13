import * as React from "react"
import { inject, observer } from "mobx-react"
import { UserStore } from "../store/UserStore"

@inject("rootStore")
@observer
export class App extends React.Component<any, any> {

    public componentWillMount() {
        this.userStore = this.props.rootStore.userStore
    }

    private userStore: UserStore

    public render() {
        return (
            <div>
                <h2>CLO Workflows</h2>
                <div>{`current user: ${this.userStore.currentUser.name}`}</div>
            </div>
        )
    }
}
