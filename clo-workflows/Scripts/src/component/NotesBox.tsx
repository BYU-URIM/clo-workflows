import * as React from "react"
import { INote, NoteScope, NoteSource, getEmptyNote } from "../model/Note"
import { observer } from "mobx-react"
import { NonScrollableList, IListItem } from "./NonScrollableList"
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button"
import { autobind } from "core-decorators"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { Dialog, DialogFooter, DialogType } from "office-ui-fabric-react"
import { IUser } from "../model/User"
import { deepCopy } from "../utils"

interface INotesBoxProps {
    title: string
    notes: ReadonlyArray<INote>
    onCreateNote: (noteToCreate: INote, noteSource: NoteSource) => Promise<boolean>
    onUpdateNote: (noteToUpdate: INote, noteSource: NoteSource) => Promise<boolean>
    onDeleteNote: (noteToDelete: INote, noteSource: NoteSource) => Promise<boolean>
    currentUser: IUser
    noteSource: NoteSource
    maxScope?: NoteScope
    disableButtons?: boolean
}

interface INotesBoxState {
    showNoteDialog: boolean,
    // how many notes to display
    displayCount: number,
    // at what interval the display count may be incrased by when the "view __ more notes" button is clicked
    // has a default value of 3, unless there are fewer than 3 notes remaining to display
    displayCountChangeInterval: number
    selectedNote: INote
    selectedNoteOperation: NoteOperation // state of selected note (is it being created of updated ?)
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
export class NotesBox extends React.Component<INotesBoxProps, INotesBoxState> {
    constructor(props: INotesBoxProps) {
        super(props)
        this.state = {
            showNoteDialog: false,
            displayCount: this.DEFAULT_DISPLAY_COUNT,
            displayCountChangeInterval: this.getDisplayCountChangeInterval(props.notes.length, this.DEFAULT_DISPLAY_COUNT),
            selectedNote: null,
            selectedNoteOperation: null
        }
    }

    private readonly DEFAULT_DISPLAY_COUNT = 3
    private readonly MAX_DISPLAY_COUNT_CHANGE_INTERVAL = 3

    public componentWillReceiveProps(nextProps: INotesBoxProps) {
        if(nextProps.notes.length !== this.props.notes.length) {
            this.setDisplayState(this.DEFAULT_DISPLAY_COUNT, this.state.showNoteDialog, nextProps)
        }
    }

    public render() {
        const { props, state } = this
        return (
            <div style={notesWrapperStyles}>
                <div style={notesTitleStyles}>{props.title}</div>
                <div style={addNoteButtonStyles}>
                    <PrimaryButton
                        text="Add Note"
                        iconProps={{iconName: "Add"}}
                        onClick={this.toggleDisplayNoteEntry}
                        disabled={props.disableButtons}
                        onMenuClick={this.props.maxScope === NoteScope.CLIENT ? () => this.onClickAddNote(NoteScope.CLIENT) : () => null}
                        menuProps={ this.props.maxScope === NoteScope.EMPLOYEE && {
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
                { props.notes.length ? (
                    <div> 
                        <NonScrollableList
                            items={props.notes.slice(0, this.state.displayCount).map(note => ({
                                header: `${note.submitter} - ${note.dateSubmitted}`,
                                subheader: props.maxScope === NoteScope.EMPLOYEE ? `${note.scope} level note` : null,
                                body: note.text,
                                id: note.Id,
                                deletable: note.submitter === props.currentUser.name,
                                editable: note.submitter === props.currentUser.name
                            }))}
                            onEditItem={this.onClickEditNote}
                            onDeleteItem={this.onClickDeleteNote}
                        />
                        <div style={rightAlignedButtonStyles}>
                            <PrimaryButton
                                text={`view ${this.state.displayCountChangeInterval} more`}
                                iconProps={{iconName: "Add"}}
                                onClick={this.onDisplayCountChange}
                                disabled={!this.state.displayCountChangeInterval}
                            />
                        </div>
                    </div>
                ) : (    
                    <div style={noNotesMessageStyles}>
                        {`no ${props.title.toLowerCase()} have been submitted yet`}
                    </div>
                )}

                <Dialog
                    hidden={!this.state.showNoteDialog}
                    modalProps={{isBlocking: false}}
                    onDismiss={() => this.setState({showNoteDialog: false})}
                    dialogContentProps={{
                        title: "Enter Note Text",
                        subText: `attach a note to this ${props.noteSource}`
                    }}
                >
                    <TextField
                        multiline
                        onChanged={this.onEditNoteEntry}
                        value={this.state.selectedNote && this.state.selectedNote.text}
                    />
                    <DialogFooter>
                        <PrimaryButton
                            text="submit note"
                            onClick={this.onClickSubmitNote}
                            disabled={!(this.state.selectedNote && this.state.selectedNote.text) || this.props.disableButtons}
                        />
                    </DialogFooter>
                </Dialog>
    
            </div>
        )
    }

    private onClickAddNote(noteScope: NoteScope): void {
        this.setState({
            showNoteDialog: true,
            selectedNote: getEmptyNote(noteScope),
            selectedNoteOperation: NoteOperation.CREATE_NOTE
        })
    }

    private onClickEditNote(noteListItem: IListItem, index: number) {
        this.setState({
            showNoteDialog: true,
            selectedNote: deepCopy(this.props.notes[index]),
            selectedNoteOperation: NoteOperation.UPDATE_NOTE
        })
    }

    private async onClickDeleteNote(noteListItem: IListItem, index: number) {
        const { props } = this
        await props.onDeleteNote(props.notes[index], props.noteSource)
    }

    // called when the note entry text box (in the note dialog) is modified
    private onEditNoteEntry(newVal: string) {
        this.setState({
            selectedNote: {...this.state.selectedNote, ...{text: newVal}}
        })
    }

    private toggleDisplayNoteEntry(): void {
        this.setState({ showNoteDialog: !this.state.showNoteDialog })
    }

    private async onClickSubmitNote(): Promise<void> {
        let wasNoteSubmitted: boolean
        if(this.state.selectedNoteOperation === NoteOperation.CREATE_NOTE) {
            wasNoteSubmitted = await this.props.onCreateNote(this.state.selectedNote, this.props.noteSource)
        } else if(this.state.selectedNoteOperation === NoteOperation.UPDATE_NOTE) {
            wasNoteSubmitted = await this.props.onUpdateNote(this.state.selectedNote, this.props.noteSource)
        }

        if(wasNoteSubmitted) {
            this.setDisplayState(this.DEFAULT_DISPLAY_COUNT, false)
            this.clearNoteState()
        }
    }

    private onDisplayCountChange(): void {
        if(this.state.displayCountChangeInterval) {
            // update the display count by the display count interval
            const newDisplayCount = this.state.displayCount + this.state.displayCountChangeInterval
            this.setDisplayState(newDisplayCount)
        }
    }

    private setDisplayState(displayCount: number, showNoteDialog: boolean = this.state.showNoteDialog, props: INotesBoxProps = this.props) {
        this.setState({
            showNoteDialog,
            displayCount,
            displayCountChangeInterval: this.getDisplayCountChangeInterval(props.notes.length, displayCount)
        })
    }

    private clearNoteState() {
        this.setState({
            selectedNote: null,
            selectedNoteOperation: null
        })
    }

    private getDisplayCountChangeInterval(notesLength: number, displayCount: number): number {
        return Math.min(
            this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL,
            this.zeroFloor(notesLength - displayCount)
        )
    }

    private zeroFloor(val: number): number {
        return val >= 0 ? val : 0
    }

    public static defaultProps: Partial<INotesBoxProps> = {
        notes: [],
        maxScope: NoteScope.CLIENT
    }

}
