import * as React from "react"
import { INote } from "../model/Note"
import { observer } from "mobx-react"
import { NonScrollableList } from "./NonScrollableList"
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button"
import { autobind } from "core-decorators"
import { TextField } from "office-ui-fabric-react/lib/TextField"

interface INotesBoxProps {
    title: string
    notes: INote[]
    onSubmitNoteEntry: () => Promise<boolean>
    onUpdateNoteEntry: (text: string) => void
    noteEntry: string
    disableButtons?: boolean
}

interface INotesBoxState {
    isDisplayNoteEntry: boolean,
    displayCount: number,
    displayCountChangeInterval: number
}

const notesWrapperStyles = {
    backgroundColor: "#F0F0F0",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
    width: 320,
    padding: 10,
}

const notesTitleStyles = {
    textAlign: "center",
    font: "26px Segoe UI, sans-serif",
    marginBottom: 8,
} as React.CSSProperties

const noNotesMessageStyles = {
    textAlign: "center",
    fontSize: 20,
    fontWeight: 200,
    margin: "18px 0",
} as React.CSSProperties

const newNoteButtonStyles = {
    display: "flex",
    justifyContent: "center",
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
            isDisplayNoteEntry: false,
            // how many notes to display
            displayCount: this.DEAFULT_DISPLAY_COUNT,
            // at what interval the display count may be incrased by when the "view __ more notes" button is clicked
            // has a default value of 3, unless there are fewer than 3 notes remaining to display
            displayCountChangeInterval: Math.min(this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL, props.notes.length - this.DEAFULT_DISPLAY_COUNT),
        }
    }

    private readonly DEAFULT_DISPLAY_COUNT = 3
    private readonly MAX_DISPLAY_COUNT_CHANGE_INTERVAL = 3

    public componentWillReceiveProps(nextProps: INotesBoxProps) {
        if(nextProps.notes.length !== this.props.notes.length) {
            this.setState({
                displayCount: this.DEAFULT_DISPLAY_COUNT,
                displayCountChangeInterval: Math.min(this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL, nextProps.notes.length - this.DEAFULT_DISPLAY_COUNT),
            })
        }
    }

    public render() {
        const { props, state } = this
        return (
            <div style={notesWrapperStyles}>
                <div style={notesTitleStyles}>{props.title}</div>
                <div style={newNoteButtonStyles}>
                    <PrimaryButton
                        text="Add Note"
                        onClick={this.toggleDisplayNoteEntry}
                        disabled={props.disableButtons}
                    />
                </div>
                { state.isDisplayNoteEntry && (
                    <div style={noteEntryStyles}>
                        <TextField 
                            multiline
                            onChanged={props.onUpdateNoteEntry}
                            value={props.noteEntry}
                        />
                        <div style={rightAlignedButtonStyles}>
                            <PrimaryButton
                                text="Submit"
                                disabled={props.disableButtons || !props.noteEntry}
                                onClick={this.onSubmitNoteEntry}
                            />
                        </div>
                    </div>
                )}
                { props.notes.length ? (
                    <div> 
                        <NonScrollableList
                            items={props.notes.slice(0, this.state.displayCount).map(note => ({
                                header: `${note.submitter} - ${note.dateSubmitted}`,
                                body: note.text,
                                id: note.workId || note.projectId
                            }))}
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
    
            </div>
        )
    }

    private toggleDisplayNoteEntry(): void {
        this.setState({
            isDisplayNoteEntry: !this.state.isDisplayNoteEntry
        })
    }

    private async onSubmitNoteEntry(): Promise<void> {
        const wasNoteSubmitted = await this.props.onSubmitNoteEntry()
        if(wasNoteSubmitted) {
            this.setState({
                isDisplayNoteEntry: false,
                displayCount: this.DEAFULT_DISPLAY_COUNT,
                displayCountChangeInterval: Math.min(this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL, this.props.notes.length - this.DEAFULT_DISPLAY_COUNT),
            })
        }
    }

    private onDisplayCountChange(): void {
        if(this.state.displayCountChangeInterval) {
            // update the display count by the display count interval
            const newDisplayCount = this.state.displayCount + this.state.displayCountChangeInterval
            this.setState({
                displayCount: newDisplayCount,
                displayCountChangeInterval: Math.min(this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL, this.props.notes.length - newDisplayCount)
            })
        }
    }

}
