import { inject, observer } from "mobx-react"
import * as React from "react"

import { ClientStore } from "../store/ClientStore"
import { SessionStore } from "../store/SessionStore"
import Header from "./Header"
import { ProjectProcessList } from "./ProjectProcessList"
import ProjectFormModal from "./ProjectFormModal"
import ProcessFormModal from "./ProcessFormModal"
import { Message } from "./Message"

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
        return (
            <div>
                <ProjectFormModal
                    clientStore={this.clientStore}
                    togglePanel={(m, v?) => {
                        this.clientStore.updateViewState(m, v)
                    }}
                />
                <ProcessFormModal
                    clientStore={this.clientStore}
                    togglePanel={(m, v?) => {
                        this.clientStore.updateViewState(m, v)
                    }}
                />
                <ProjectProcessList
                    _processes={this.clientStore.clientProcesses}
                    _projects={this.clientStore.clientProjects}
                    message={this.clientStore.message}
                    handleSubmit={(projectId: any) => this.clientStore.handleAddNewProcess(projectId)}
                    updateViewState={(k: string, v: any) => {
                        this.clientStore.updateViewState(k, v)
                    }}
                />
                {this.clientStore.message && <Message {...this.clientStore.message} />}
            </div>
        )
    }
}
