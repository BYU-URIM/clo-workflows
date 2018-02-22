import { inject, observer } from "mobx-react"
import * as React from "react"

import { ClientStore } from "../store/ClientStore"
import { SessionStore } from "../store/SessionStore"
import Header from "./Header"
import { ProjectProcessList } from "./ProjectProcessList"
/******************************
 * TODO:
 * decide wether or not to keep this, and if so what will be handled

 ******************************/
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
        return <ProjectProcessList />
    }
}
