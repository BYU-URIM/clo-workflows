import * as React from "react"
import { INote } from "../model/Note"
import { observer } from "mobx-react"
import { NonScrollableList } from "./NonScrollableList"
import { Button } from "office-ui-fabric-react/lib/Button"

interface INotesBoxProps {
    title: string
    notes: INote[]
    onAddNote: () => void
    displayCount: number
}

const notesWrapperStyles = {
    backgroundColor: "#F0F0F0",
    boxShadow: "2px 4px #D3D3D3",
    maxWidth: 320,
    padding: 10,
}

const notesTitleStyles = {
    textAlign: "center",
    fontSize: 25,
    fontWeight: 600,
    marginBottom: 8,
} as React.CSSProperties

const newNoteButtonStyles = {
    display: "flex",
    justifyContent: "center",
} as React.CSSProperties


function NotesBox(props: INotesBoxProps) {
    return (
        <div style={notesWrapperStyles}>
            <div style={notesTitleStyles}>{props.title}</div>
            <div style={newNoteButtonStyles}>
                <Button text="Add Note" primary />
            </div>
            <NonScrollableList
                items={props.notes.slice(0, props.displayCount).map(note => ({
                    header: `${note.submitter} - ${note.dateSubmitted}`,
                    body: note.text,
                    id: note.workId || note.projectId
                }))}
            />
        </div>
    )
}

export default observer(NotesBox)
