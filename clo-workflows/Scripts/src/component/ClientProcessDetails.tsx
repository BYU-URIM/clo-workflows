import * as React from "react"
import { NotesBox, INotesBoxProps } from "./NotesBox"
import { NoteScope, NoteSource } from "../model/Note"
import { ClientStoreData, ClientViewState } from "../store/ClientStore/index"
import { ClientStore } from "../store/ClientStore/ClientStore"
export interface IClientProcessDetailsProps {
    data: ClientStoreData
    view: ClientViewState
    selectedNotes
    clientStore: ClientStore
}
export const ClientProcessDetails = (props: IClientProcessDetailsProps) => {
    return (
        <div>
            <NotesBox
                title={"Request Notes"}
                notes={props.clientStore.selectedNotes}
                onCreateNote={props.clientStore.submitNewNote}
                onUpdateNote={props.clientStore.updateNote}
                onDeleteNote={props.clientStore.deleteNote}
                currentUser={props.data.currentUser}
                noteSource={NoteSource.WORK}
                maxScope={NoteScope.CLIENT}
            />
        </div>
    )
}
