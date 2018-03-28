import { inject, observer } from "mobx-react"
import * as React from "react"

import { ClientStore } from "../store/ClientStore/ClientStore"
import { SessionStore } from "../store/SessionStore"
import Header from "./Header"
import { ProjectProcessList } from "./ProjectProcessList"
import ProjectFormModal from "./ProjectFormModal"
import ProcessFormModal from "./ProcessFormModal"
import { Message } from "./Message"
import { ClientProcessDetails } from "./ClientProcessDetails"
import { ClientProjectDetails } from "./ClientProjectDetails"

const wrapper = {
    display: "inline-flex",
    width: "100%",
    height: "auto",
} as React.CSSProperties
const rightSection = {
    margin: "0",
    padding: "30px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "50%",
} as React.CSSProperties
const leftSection = {
    margin: "0",
    padding: "10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "50%",
    boxShadow: "0 5px 10px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.18)",
} as React.CSSProperties

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
            <div style={wrapper}>
                <div style={leftSection}>
                    <ProjectProcessList
                        messageVisible={clientStore.message}
                        processes={clientStore.data.clientProcesses}
                        projects={clientStore.data.clientProjects}
                        handleSubmit={(projectId: any) => clientStore.handleAddNewProcess(projectId)}
                        view={clientStore.view}
                    />
                </div>
                <div style={rightSection}>
                    {this.clientStore.view.process.id && (
                        <ClientProcessDetails
                            view={this.clientStore.view}
                            data={this.clientStore.data}
                            selectedNotes={this.clientStore.selectedNotes}
                            clientStore={this.clientStore}
                        />
                    )}
                    {this.clientStore.view.project.id && (
                        <ClientProjectDetails
                            view={this.clientStore.view}
                            data={this.clientStore.data}
                            selectedNotes={this.clientStore.selectedNotes}
                            clientStore={this.clientStore}
                        />
                    )}
                </div>
                {clientStore.view.modal === "project" && <ProjectFormModal clientStore={clientStore} />}
                {clientStore.view.modal === "process" && <ProcessFormModal clientStore={clientStore} />}
                {clientStore.message && <Message {...clientStore.message} />}
            </div>
        )
    }
}
