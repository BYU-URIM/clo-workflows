import * as React from "react"
import { NotesBox, INotesBoxProps } from "./NotesBox"
import { NoteScope, NoteSource } from "../model/Note"
import { ComputableState, ClientStoreData, ClientViewState } from "../store/ClientStore/index"
export interface IClientProcessDetailsProps {
    data: ClientStoreData
    view: ClientViewState
    computable: ComputableState
}
export const ClientProcessDetails = (props: IClientProcessDetailsProps) => {
    const notesBoxProps: INotesBoxProps = {
        title: "Notes",
        notes: props.computable.selectedNotes,
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
