import * as React from "react"
import { IUser, INote, NoteScope, NoteSource, getEmptyNote } from "../../model/"
import { observer } from "mobx-react"
import { NonScrollableList, IListItem } from "../"
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button"
import { autobind } from "core-decorators"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { Dialog, DialogFooter, DialogType } from "office-ui-fabric-react"
import Utils from "../../utils"
import { NotesStore } from "../../store"
import "./styles.scss"

interface INotesBoxProps {
    notesStore: NotesStore
    title: string
}

enum NoteOperation {
    UPDATE_NOTE = "update_note",
    CREATE_NOTE = "create_note",
}

@autobind
@observer
export default class NotesBox extends React.Component<INotesBoxProps, any> {
    public render() {
        const { props } = this
        const { notesStore } = props
        const currentUser = notesStore.provider.root.sessionStore.currentUser
        return (
            <div className="notesBox-notesWrapper-styles">
                <div className="notesBox-notesTitle-styles">{this.props.title}</div>
                <div className="notesBox-addNoteButton-styles">
                    <PrimaryButton
                        text="Add Note"
                        iconProps={{ iconName: "Add" }}
                        onClick={notesStore.maxScope === NoteScope.CLIENT ? () => this.onClickAddNote(NoteScope.CLIENT) : () => null}
                        disabled={notesStore.provider.asyncPendingLockout}
                        menuProps={
                            notesStore.maxScope === NoteScope.EMPLOYEE && {
                                items: [
                                    {
                                        key: "clientNote",
                                        name: "Client Note",
                                        onClick: () => this.onClickAddNote(NoteScope.CLIENT),
                                    },
                                    {
                                        key: "employeeNote",
                                        name: "Employee Note",
                                        onClick: () => this.onClickAddNote(NoteScope.EMPLOYEE),
                                    },
                                ],
                            }
                        }
                    />
                </div>
                {notesStore.notes.length ? (
                    <div>
                        <NonScrollableList
                            items={notesStore.notes.slice(0, notesStore.displayCount).map(note => ({
                                header: `${note.submitter} - ${note.dateSubmitted}`,
                                subheader: notesStore.maxScope === NoteScope.EMPLOYEE ? `${note.scope} level note` : null,
                                body: note.text,
                                id: note.Id,
                                deletable: note.submitter === currentUser.name && !notesStore.provider.asyncPendingLockout,
                                editable: note.submitter === currentUser.name && !notesStore.provider.asyncPendingLockout,
                            }))}
                            onEditItem={this.onClickEditNote}
                            onDeleteItem={this.onClickDeleteNote}
                        />
                        <div className="notesBox-rightAlignedButton-styles">
                            <PrimaryButton
                                text={`view ${notesStore.displayCountChangeInterval} more`}
                                iconProps={{ iconName: "Add" }}
                                onClick={notesStore.increaseDisplayCount}
                                disabled={notesStore.provider.asyncPendingLockout || !notesStore.displayCountChangeInterval}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="notesBox-noNotesMessage-styles">{`no ${props.title.toLowerCase()} have been submitted yet`}</div>
                )}

                <Dialog
                    hidden={!notesStore.showNoteDialog}
                    modalProps={{ isBlocking: false }}
                    onDismiss={notesStore.unselectNote}
                    dialogContentProps={{
                        title: "Enter Note Text",
                        subText: `attach a note to this ${notesStore.source}`,
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
