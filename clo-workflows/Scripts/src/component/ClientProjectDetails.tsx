import * as React from "react"
import { NotesBox, INotesBoxProps } from "./NotesBox"
import { NoteScope, NoteSource } from "../model/Note"
import { ClientStoreData, ClientViewState } from "../store/ClientStore/index"
import { ClientStore } from "../store/ClientStore/ClientStore"
import { observable } from "mobx/lib/api/observable"
export interface IClientProcessDetailsProps {
    data: ClientStoreData
    view: ClientViewState
    selectedNotes
    clientStore: ClientStore
}
export const ClientProjectDetails = (props: IClientProcessDetailsProps) => {
    return (
        <div>
            <NotesBox
                title={"Project Notes"}
                notes={props.clientStore.selectedNotes}
                onCreateNote={props.clientStore.submitNewNote}
                onUpdateNote={props.clientStore.updateNote}
                onDeleteNote={props.clientStore.deleteNote}
                currentUser={props.data.currentUser}
                noteSource={NoteSource.PROJECT}
                maxScope={NoteScope.CLIENT}
            />
        </div>
    )
}
