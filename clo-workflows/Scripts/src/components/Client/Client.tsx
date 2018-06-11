import { inject, observer } from "mobx-react"
import * as React from "react"
import { ClientStore } from "../../store/"
import { NotesBox, Message, ProcessFormModal, ProjectFormModal, ProjectProcessList } from "../"

import "./styles.scss"

@inject("rootStore")
@observer
export default class Client extends React.Component<any, any> {
    public componentWillMount() {
        this.clientStore = this.props.rootStore.clientStore
    }
    clientStore: ClientStore

    render() {
        const clientStore = this.clientStore
        return (
            <div>
                <div className="client-wrapper-styles">
                    <div className="client-left-section-styles">
                        <ProjectProcessList
                            asyncPendingLockout={clientStore.asyncPendingLockout}
                            data={this.clientStore.data}
                            handleSubmit={(projectId: any) => clientStore.handleAddNewProcess(projectId)}
                            view={clientStore.view}
                        />
                    </div>
                    <div className="client-right-section-styles">
                        {this.clientStore.view.notesType && (
                            <NotesBox title={clientStore.view.notesTitle} notesStore={clientStore.selectedNotesStore} />
                        )}
                    </div>
                </div>
                {clientStore.view.modal === "project" && <ProjectFormModal clientStore={clientStore} />}
                {clientStore.view.modal === "process" && <ProcessFormModal clientStore={clientStore} />}
                {clientStore.message && <Message {...clientStore.message} />}
            </div>
        )
    }
}
