import { autobind } from "core-decorators"
import { observable, action, runInAction, computed, toJS, reaction } from "mobx"
import { INote, NoteSource, NoteScope, getEmptyNote } from "./../../model/"
import { IDataService } from "./../../service/"
import { StoreUtils } from ".."
import Utils from "./../../utils"
import { IViewProvider } from "../ViewProvider"

export interface INotesStoreConfig {
    viewProvider: IViewProvider
    dataService: IDataService
    source: NoteSource
    maxScope: NoteScope
    notes: INote[]
    attachedClientId: string
    attachedWorkId?: number
    attachedProjectId?: number
}

@autobind
export class NotesStore {
    constructor(config: INotesStoreConfig) {
        this.provider = config.viewProvider
        this.dataService = config.dataService
        this.source = config.source
        this.maxScope = config.maxScope
        this.notes = config.notes
        this.attachedClientId = config.attachedClientId
        this.attachedWorkId = config.attachedWorkId
        this.attachedProjectId = config.attachedProjectId

        this.displayCount = Math.min(this.DEFAULT_DISPLAY_COUNT, this.notes.length)

        reaction(() => this.notes.length, () => Math.min(this.DEFAULT_DISPLAY_COUNT, this.notes.length))
    }

    readonly source: NoteSource
    readonly maxScope: NoteScope
    readonly provider: IViewProvider
    private readonly dataService: IDataService
    private readonly attachedClientId: string
    private readonly attachedWorkId: number
    private readonly attachedProjectId: number

    @observable notes: INote[]
    @observable displayCount: number
    @observable selectedNote: INote

    @computed
    get showNoteDialog(): boolean {
        return !!this.selectedNote
    }

    @computed
    get selectedNoteOperation(): NoteOperation {
        // if a note has a submitter and submission metadata
        // it has already been submitted and we are currently updating it
        // otherwise, it is a new note
        if (this.selectedNote) {
            return this.selectedNote.submitter && this.selectedNote.dateSubmitted && this.selectedNote.Id
                ? NoteOperation.UPDATE_NOTE
                : NoteOperation.CREATE_NOTE
        }
    }

    @computed
    get displayCountChangeInterval(): number {
        return Math.min(this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL, this.zeroFloor(this.notes.length - this.displayCount))
    }

    @action
    increaseDisplayCount() {
        this.displayCount += this.displayCountChangeInterval
    }

    @action
    updateSelectedNoteText(newVal: string) {
        this.selectedNote.text = newVal
    }

    private readonly DEFAULT_DISPLAY_COUNT = 3
    private readonly MAX_DISPLAY_COUNT_CHANGE_INTERVAL = 3

    // handler for the note dialog submit button, contains logic to determine whether note should be created or updated
    async submitSelectedNote(): Promise<void> {
        if (this.selectedNoteOperation === NoteOperation.CREATE_NOTE) {
            await this.createSelectedNote()
        } else if (this.selectedNoteOperation === NoteOperation.UPDATE_NOTE) {
            await this.updateSelectedNote()
        }
    }

    @action
    private async createSelectedNote(): Promise<void> {
        this.provider.setAsyncPendingLockout(true)

        try {
            // fill in any info the new note needs before submission
            this.selectedNote.dateSubmitted = Utils.getFormattedDate()
            this.selectedNote.submitter = this.provider.root.sessionStore.currentUser.name

            const addResult = await this.dataService.createNote(toJS(this.selectedNote))
            this.selectedNote.Id = addResult.data.Id // assign the assigned SP ID to the newly created note

            // if submission is successful, add the new note to the corresponding list
            runInAction(() => this.notes.unshift(this.selectedNote))
            this.provider.postMessage({ messageText: "note successfully submitted", messageType: "success" })
            this.unselectNote()
        } catch (error) {
            console.error(error)
            this.provider.postMessage({
                messageText: "there was a problem submitting your note, try again",
                messageType: "error",
            })
        } finally {
            this.provider.setAsyncPendingLockout(false)
        }
    }

    @action
    private async updateSelectedNote(): Promise<void> {
        this.provider.setAsyncPendingLockout(true)

        try {
            this.selectedNote.dateSubmitted = Utils.getFormattedDate()
            await this.dataService.updateNote(toJS(this.selectedNote))

            // if submission is successful, add the new note to the corresponding list
            StoreUtils.replaceElementInListById(this.selectedNote, this.notes)
            this.provider.postMessage({ messageText: "note successfully updated", messageType: "success" })
            this.unselectNote()
        } catch (error) {
            console.error(error)
            this.provider.postMessage({
                messageText: "there was a problem updating your note, try again",
                messageType: "error",
            })
        } finally {
            this.provider.setAsyncPendingLockout(false)
        }
    }

    @action
    async deleteNote(noteToDelete: INote): Promise<void> {
        this.provider.setAsyncPendingLockout(true)

        try {
            await this.dataService.deleteNote(noteToDelete.Id)

            // if deletion is successful, remove the new note from the corresponding list
            StoreUtils.removeELementInListById(this.notes)
            this.provider.postMessage({ messageText: "note successfully deleted", messageType: "success" })
        } catch (error) {
            console.error(error)
            this.provider.postMessage({
                messageText: "there was a problem deleting your note, try again",
                messageType: "error",
            })
        } finally {
            this.provider.setAsyncPendingLockout(false)
        }
    }

    @action
    selectNewNote(noteScope: NoteScope): void {
        this.selectedNote = getEmptyNote(noteScope)

        // initialize an empty note with starting information
        if (this.selectedNote.scope === NoteScope.CLIENT) {
            this.selectedNote.attachedClientId = this.attachedClientId
        }

        if (this.source === NoteSource.PROJECT) {
            this.selectedNote.projectId = String(this.attachedProjectId)
        } else if (this.source === NoteSource.WORK) {
            this.selectedNote.workId = String(this.attachedWorkId)
        }
    }

    @action
    selectExistingNote(noteToSelect: INote) {
        this.selectedNote = Utils.deepCopy(noteToSelect)
    }

    @action
    unselectNote() {
        this.selectedNote = null
    }

    // HELPERS

    private zeroFloor(val: number): number {
        return val >= 0 ? val : 0
    }
}

enum NoteOperation {
    UPDATE_NOTE = "update_note",
    CREATE_NOTE = "create_note",
}
