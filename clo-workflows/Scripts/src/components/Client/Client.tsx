import { inject, observer } from "mobx-react"
import * as React from "react"
import { ClientStore } from "../../store/"
import { NotesBox, Message, ProcessFormModal, ProjectFormModal, ProjectProcessList } from "../"

import "./styles.scss"

@inject("rootStore")
@observer
export class Client extends React.Component<any, any> {
    public componentWillMount() {
        this.clientStore = this.props.rootStore.clientStore
    }
    clientStore: ClientStore

    render() {
        return (
            <>
                <div className="client-wrapper-styles">
                    <div className="client-left-section-styles">
                        <ProjectProcessList
                            asyncPendingLockout={this.clientStore.asyncPendingLockout}
                            data={this.clientStore.data}
                            handleSubmit={(projectId: any) => this.clientStore.handleAddNewProcess(projectId)}
                            view={this.clientStore.view}
                        />
                    </div>
                    <div className="client-right-section-styles">
                        {this.clientStore.view.notesType && (
                            <NotesBox title={this.clientStore.view.notesTitle} notesStore={this.clientStore.selectedNotesStore} />
                        )}
                    </div>
                </div>
                {this.clientStore.view.modal === "project" && <ProjectFormModal clientStore={this.clientStore} />}
                {this.clientStore.view.modal === "process" && <ProcessFormModal clientStore={this.clientStore} />}
                {this.clientStore.message && <Message {...this.clientStore.message} />}
            </>
        )
    }
}
