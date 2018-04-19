import { autobind } from "core-decorators"
import { observable, action, runInAction, computed, toJS } from "mobx"
import { INote, NoteSource, NoteScope, getEmptyNote } from "../../model/Note"
import { RequestDetailStore } from "./RequestDetailStore"
import { IDataService } from "../../service/dataService/IDataService"
import { EmployeeStore } from "./EmployeeStore"
import Utils from "../../utils"
import StoreUtils from "../StoreUtils"
import { IListItem } from "../../component/NonScrollableList"

@autobind
export class NotesStore {
    constructor (
        public readonly requestDetailStore: RequestDetailStore,
        private readonly dataService: IDataService,
        public readonly source: NoteSource,
        public readonly maxScope: NoteScope,
        notes: INote[]
    ) {
        this.notes = notes
        this.employeeStore = this.requestDetailStore.employeeStore

        this.displayCount = Math.min(this.DEFAULT_DISPLAY_COUNT, notes.length)
    }

    public readonly employeeStore: EmployeeStore
    @observable notes: INote[]
    @observable displayCount: number
    @observable selectedNote: INote

    @computed get showNoteDialog(): boolean {
        return !!this.selectedNote
    }

    @computed get selectedNoteOperation(): NoteOperation {
        // if a note has a submitter and submission metadata, it has already been submitted and we are currently updating it
        // otherwise, it is a new note
        if(this.selectedNote) {
            return this.selectedNote.submitter && this.selectedNote.dateSubmitted && this.selectedNote.Id
                ? NoteOperation.UPDATE_NOTE
                : NoteOperation.CREATE_NOTE
        }
    }

    @computed get displayCountChangeInterval(): number {
        return Math.min(
            this.MAX_DISPLAY_COUNT_CHANGE_INTERVAL,
            this.zeroFloor(this.notes.length - this.displayCount)
        )
    }

    @action increaseDisplayCount() {
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
        if(this.selectedNoteOperation === NoteOperation.CREATE_NOTE) {
            await this.createSelectedNote()
        } else if(this.selectedNoteOperation === NoteOperation.UPDATE_NOTE) {
            await this.updateSelectedNote()
        }
    }

    @action
    private async createSelectedNote(): Promise<void> {
        this.employeeStore.setAsyncPendingLockout(true)

        try {
            // fill in any info the new note needs before submission
            this.selectedNote.dateSubmitted = Utils.getFormattedDate()
            this.selectedNote.submitter = this.employeeStore.root.sessionStore.currentUser.name

            const addResult = await this.dataService.createNote(toJS(this.selectedNote))
            this.selectedNote.Id = addResult.data.Id // assign the assigned SP ID to the newly created note

            // if submission is successful, add the new note to the corresponding list
            runInAction(() => this.notes.unshift(this.selectedNote))
            this.employeeStore.postMessage({messageText: "note successfully submitted", messageType: "success"})
            this.unselectNote()
        } catch(error) {
            console.error(error)
            this.employeeStore.postMessage({messageText: "there was a problem submitting your note, try again", messageType: "error"})
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    @action
    private async updateSelectedNote(): Promise<void> {
        this.employeeStore.setAsyncPendingLockout(true)

        try {
            this.selectedNote.dateSubmitted = Utils.getFormattedDate()
            await this.dataService.updateNote(toJS(this.selectedNote))

            // if submission is successful, add the new note to the corresponding list
            StoreUtils.replaceElementInListById(this.selectedNote, this.notes)
            this.employeeStore.postMessage({messageText: "note successfully updated", messageType: "success"})
            this.unselectNote()
        } catch(error) {
            console.error(error)
            this.employeeStore.postMessage({messageText: "there was a problem updating your note, try again", messageType: "error"})
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    @action
    async deleteNote(noteToDelete: INote): Promise<void> {
        this.employeeStore.setAsyncPendingLockout(true)

        try {
            await this.dataService.deleteNote(noteToDelete.Id)

            // if deletion is successful, remove the new note from the corresponding list
            StoreUtils.removeELementInListById(noteToDelete, this.notes)
            this.employeeStore.postMessage({messageText: "note successfully deleted", messageType: "success"})
        } catch(error) {
            console.error(error)
            this.employeeStore.postMessage({messageText: "there was a problem deleting your note, try again", messageType: "error"})
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
    }

    @action
    selectNewNote(noteScope: NoteScope): void {
        this.selectedNote = getEmptyNote(noteScope)

        // initialize an empty note with starting information
        if(this.selectedNote.scope === NoteScope.CLIENT) {
            this.selectedNote.attachedClientId = this.requestDetailStore.process.get("submitterId") as string
        }

        if(this.source === NoteSource.PROJECT) {
            this.selectedNote.projectId = String(this.requestDetailStore.project.get("Id"))
        } else if(this.source === NoteSource.WORK) {
            this.selectedNote.workId = String(this.requestDetailStore.work.get("Id"))
        }
    }

    @action
    selectExistingNote(noteToSelect: INote) {
        this.selectedNote = Utils.deepCopy(noteToSelect)
    }

    @action unselectNote() {
        this.selectedNote = null
    }

    // HELPERS


    private zeroFloor(val: number): number {
        return val >= 0 ? val : 0
    }
}

enum NoteOperation {
    UPDATE_NOTE = "update_note",
    CREATE_NOTE = "create_note"
}

