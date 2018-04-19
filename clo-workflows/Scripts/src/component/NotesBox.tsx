import * as React from "react"
import { INote, NoteScope, NoteSource, getEmptyNote } from "../model/Note"
import { observer } from "mobx-react"
import { NonScrollableList, IListItem } from "./NonScrollableList"
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button"
import { autobind } from "core-decorators"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { Dialog, DialogFooter, DialogType } from "office-ui-fabric-react"
import { IUser } from "../model/User"
import Utils from "../utils"
import { NotesStore } from "../store/EmployeeStore/NotesStore"
// export interface INotesBoxProps {
//     title: string
//     notes: ReadonlyArray<INote>
//     onCreateNote: (noteToCreate: INote, noteSource: NoteSource) => Promise<boolean>
//     onUpdateNote: (noteToUpdate: INote, noteSource: NoteSource) => Promise<boolean>
//     onDeleteNote: (noteToDelete: INote, noteSource: NoteSource) => Promise<boolean>
//     currentUser: IUser
//     noteSource: NoteSource
//     maxScope?: NoteScope
//     disableButtons?: boolean
// }

// interface INotesBoxState {
//     showNoteDialog: boolean,
//     // how many notes to display
//     displayCount: number,
//     // at what interval the display count may be incrased by when the "view __ more notes" button is clicked
//     // has a default value of 3, unless there are fewer than 3 notes remaining to display
//     displayCountChangeInterval: number
//     selectedNote: INote
//     selectedNoteOperation: NoteOperation // state of selected note (is it being created of updated ?)
// }

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
export class NotesBox extends React.Component<INotesBoxProps, any> {

    // public componentWillReceiveProps(nextProps: INotesBoxProps) {
    //     if(nextProps.notes.length !== this.props.notes.length) {
    //         this.setDisplayState(this.DEFAULT_DISPLAY_COUNT, this.state.showNoteDialog, nextProps)
    //     }
    // }

    public render() {
        const { props } = this
        const { notesStore } = props
        const currentUser = notesStore.employeeStore.root.sessionStore.currentUser
        return (
            <div style={notesWrapperStyles}>
                <div style={notesTitleStyles}>{this.props.title}</div>
                <div style={addNoteButtonStyles}>
                    <PrimaryButton
                        text="Add Note"
                        iconProps={{iconName: "Add"}}
                        onClick={notesStore.maxScope === NoteScope.CLIENT ? () => this.onClickAddNote(NoteScope.CLIENT) : () => null}
                        disabled={notesStore.employeeStore.asyncPendingLockout}
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
                                deletable: (note.submitter === currentUser.name) && !notesStore.employeeStore.asyncPendingLockout,
                                editable: (note.submitter === currentUser.name) && !notesStore.employeeStore.asyncPendingLockout
                            }))}
                            onEditItem={this.onClickEditNote}
                            onDeleteItem={this.onClickDeleteNote}
                        />
                        <div style={rightAlignedButtonStyles}>
                            <PrimaryButton
                                text={`view ${notesStore.displayCountChangeInterval} more`}
                                iconProps={{iconName: "Add"}}
                                onClick={notesStore.increaseDisplayCount}
                                disabled={notesStore.employeeStore.asyncPendingLockout || !notesStore.displayCountChangeInterval}
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
                            disabled={!(notesStore.selectedNote && notesStore.selectedNote.text) || notesStore.employeeStore.asyncPendingLockout}
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

    // // called when the note entry text box (in the note dialog) is modified
    // private onEditNoteEntry(newVal: string) {
    //     this.setState({
    //         selectedNote: {...this.state.selectedNote, ...{text: newVal}}
    //     })
    // }

    // private toggleDisplayNoteEntry(): void {
    //     this.setState({ showNoteDialog: !this.state.showNoteDialog })
    // }

    // private async onClickSubmitNote(): Promise<void> {
    //     let wasNoteSubmitted: boolean
    //     if(this.state.selectedNoteOperation === NoteOperation.CREATE_NOTE) {
    //         wasNoteSubmitted = await this.props.onCreateNote(this.state.selectedNote, this.props.noteSource)
    //     } else if(this.state.selectedNoteOperation === NoteOperation.UPDATE_NOTE) {
    //         wasNoteSubmitted = await this.props.onUpdateNote(this.state.selectedNote, this.props.noteSource)
    //     }

    //     if(wasNoteSubmitted) {
    //         this.setDisplayState(this.DEFAULT_DISPLAY_COUNT, false)
    //         this.clearNoteState()
    //     }
    // }

    // private onDisplayCountChange(): void {
    //     if(this.state.displayCountChangeInterval) {
    //         // update the display count by the display count interval
    //         const newDisplayCount = this.state.displayCount + this.state.displayCountChangeInterval
    //         this.setDisplayState(newDisplayCount)
    //     }
    // }

    // private setDisplayState(displayCount: number, showNoteDialog: boolean = this.state.showNoteDialog, props: INotesBoxProps = this.props) {
    //     this.setState({
    //         showNoteDialog,
    //         displayCount,
    //         displayCountChangeInterval: this.getDisplayCountChangeInterval(props.notes.length, displayCount)
    //     })
    // }

    // private clearNoteState() {
    //     this.setState({
    //         selectedNote: null,
    //         selectedNoteOperation: null
    //     })
    // }

    // private getDisplayCountChangeInterval(notesLength: number, displayCount: number): number {
    //     return Math.min(
    //         this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL,
    //         this.zeroFloor(notesLength - displayCount)
    //     )
    // }

    // private zeroFloor(val: number): number {
    //     return val >= 0 ? val : 0
    // }

}
