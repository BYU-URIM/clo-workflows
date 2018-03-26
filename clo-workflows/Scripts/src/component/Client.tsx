import { inject, observer } from "mobx-react"
import * as React from "react"

import { ClientStore } from "../store/ClientStore/ClientStore"
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
        this.clientStore = this.props.rootStore.clientStore
    }
    clientStore: ClientStore

    render() {
        const clientStore = this.clientStore
        return (
            <div>
                <ProjectFormModal
                    clientStore={clientStore}
                    updateView={(m, v?) => {
                        clientStore.view.updateView(m, v)
                    }}
                />
                <ProcessFormModal
                    clientStore={clientStore}
                    updateView={(m, v?) => {
                        clientStore.view.updateView(m, v)
                    }}
                />
                <ProjectProcessList
                    messageVisible={clientStore.message}
                    processes={clientStore.clientProcesses}
                    projects={clientStore.clientProjects}
                    handleSubmit={(projectId: any) => clientStore.handleAddNewProcess(projectId)}
                    updateView={(k: string, v: any) => clientStore.view.updateView(k, v)}
                />
                {clientStore.message && <Message {...clientStore.message} />}
            </div>
        )
    }
}
