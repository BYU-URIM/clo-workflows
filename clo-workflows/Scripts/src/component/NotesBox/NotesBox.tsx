import * as React from "react"
import { IUser, INote, NoteScope, NoteSource, getEmptyNote } from "../../model/"
import { observer } from "mobx-react"
import { NonScrollableList, IListItem } from "../"
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button"
import { autobind } from "core-decorators"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { Dialog, DialogFooter, DialogType } from "office-ui-fabric-react"
import Utils from "../../utils"
import { NotesStore } from "../../store/NotesStore"

interface INotesBoxProps {
    notesStore: NotesStore,
    title: string
}

enum NoteOperation {
    UPDATE_NOTE = "update_note",
    CREATE_NOTE = "create_note"
}

const notesWrapperStyles = {
    backgroundColor: "#F0F0F0",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
    width: "320px",
    padding: "10px",
}

const notesTitleStyles = {
    textAlign: "center",
    font: "26px Segoe UI, sans-serif",
    marginBottom: "8px",
} as React.CSSProperties

const noNotesMessageStyles = {
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 200,
    margin: "18px 0",
} as React.CSSProperties

const addNoteButtonStyles = {
    display: "flex",
    justifyContent: "center",
} as React.CSSProperties

const submitNoteButtonStyles = {
    display: "flex",
    justifyContent: "center",
    marginTop: 15
} as React.CSSProperties

const noteEntryStyles = { marginTop: 10 }

const rightAlignedButtonStyles = {
    display: "flex",
    justifyContent: "flex-end",
    margin: "5px 0"
} as React.CSSProperties


@autobind
@observer
export default class NotesBox extends React.Component<INotesBoxProps, any> {
    public render() {
        const { props } = this
        const { notesStore } = props
        const currentUser = notesStore.provider.root.sessionStore.currentUser
        return (
            <div style={notesWrapperStyles}>
                <div style={notesTitleStyles}>{this.props.title}</div>
                <div style={addNoteButtonStyles}>
                    <PrimaryButton
                        text="Add Note"
                        iconProps={{iconName: "Add"}}
                        onClick={notesStore.maxScope === NoteScope.CLIENT ? () => this.onClickAddNote(NoteScope.CLIENT) : () => null}
                        disabled={notesStore.provider.asyncPendingLockout}
                        menuProps={ notesStore.maxScope === NoteScope.EMPLOYEE && {
                            items: [
                                {
                                    key: "clientNote",
                                    name: "Client Note",
                                    onClick: () => this.onClickAddNote(NoteScope.CLIENT)
                                },
                                {
                                    key: "employeeNote",
                                    name: "Employee Note",
                                    onClick: () => this.onClickAddNote(NoteScope.EMPLOYEE)
                                }
                            ]
                        }}
                    />
                </div>
                { notesStore.notes.length ? (
                    <div>
                        <NonScrollableList
                            items={notesStore.notes.slice(0, notesStore.displayCount).map(note => ({
                                header: `${note.submitter} - ${note.dateSubmitted}`,
                                subheader: notesStore.maxScope === NoteScope.EMPLOYEE ? `${note.scope} level note` : null,
                                body: note.text,
                                id: note.Id,
                                deletable: (note.submitter === currentUser.name) && !notesStore.provider.asyncPendingLockout,
                                editable: (note.submitter === currentUser.name) && !notesStore.provider.asyncPendingLockout
                            }))}
                            onEditItem={this.onClickEditNote}
                            onDeleteItem={this.onClickDeleteNote}
                        />
                        <div style={rightAlignedButtonStyles}>
                            <PrimaryButton
                                text={`view ${notesStore.displayCountChangeInterval} more`}
                                iconProps={{iconName: "Add"}}
                                onClick={notesStore.increaseDisplayCount}
                                disabled={notesStore.provider.asyncPendingLockout || !notesStore.displayCountChangeInterval}
                            />
                        </div>
                    </div>
                ) : (
                    <div style={noNotesMessageStyles}>
                        {`no ${props.title.toLowerCase()} have been submitted yet`}
                    </div>
                )}

                <Dialog
                    hidden={!notesStore.showNoteDialog}
                    modalProps={{isBlocking: false}}
                    onDismiss={notesStore.unselectNote}
                    dialogContentProps={{
                        title: "Enter Note Text",
                        subText: `attach a note to this ${notesStore.source}`
                    }}
                >
                    <TextField
                        multiline
                        onChanged={notesStore.updateSelectedNoteText}
                        value={(notesStore.selectedNote && notesStore.selectedNote.text) || ""}
                    />
                    <DialogFooter>
                        <PrimaryButton
                            text="submit note"
                            onClick={notesStore.submitSelectedNote}
                            disabled={!(notesStore.selectedNote && notesStore.selectedNote.text) || notesStore.provider.asyncPendingLockout}
                        />
                    </DialogFooter>
                </Dialog>
            </div>
        )
    }

    private onClickAddNote(noteScope: NoteScope): void {
        this.props.notesStore.selectNewNote(noteScope)
    }

    private onClickEditNote(noteListItem: IListItem, index: number) {
        this.props.notesStore.selectExistingNote(this.props.notesStore.notes[index])
    }

    private async onClickDeleteNote(noteListItem: IListItem, index: number) {
        this.props.notesStore.deleteNote(this.props.notesStore.notes[index])
    }
}
