import * as React from "react"
import { NotesBox, INotesBoxProps } from "./NotesBox"
import { NoteScope, NoteSource } from "../model/Note"
import { ClientStoreData, ClientViewState } from "../store/ClientStore/index"
export interface IClientProcessDetailsProps {
    data: ClientStoreData
    view: ClientViewState
    selectedNotes
}
export const ClientProcessDetails = (props: IClientProcessDetailsProps) => {
    const notesBoxProps: INotesBoxProps = {
        title: "Notes",
        notes: props.selectedNotes,
        onCreateNote: async e => {
            console.log(e)
            return true
        },
        onUpdateNote: async e => {
            console.log(e)
            return true
        },
        onDeleteNote: async e => {
            console.log(e)
            return true
        },
        currentUser: props.data.currentUser,
        noteSource: NoteSource.WORK,
        maxScope: NoteScope.CLIENT,
    }
    return (
        <div>
            <NotesBox {...notesBoxProps} />
        </div>
    )
}
