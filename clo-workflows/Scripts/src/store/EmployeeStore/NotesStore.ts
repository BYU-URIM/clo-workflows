import { autobind } from "core-decorators"
import { observable, action, runInAction } from "mobx"
import { INote, NoteSource, NoteScope } from "../../model/Note"
import { RequestDetailStore } from "./RequestDetailStore"
import { IDataService } from "../../service/dataService/IDataService"
import { EmployeeStore } from "./EmployeeStore"
import Utils from "../../utils"
import StoreUtils from "../StoreUtils"

@autobind
export class NotesStore {
    constructor (
        private readonly requestDetailStore: RequestDetailStore,
        private readonly dataService: IDataService,
        private readonly source: NoteSource,
        notes: INote[]
    ) {
        this.notes = notes
        this.employeeStore = this.requestDetailStore.employeeStore
    }

    @observable notes: INote[]
    private readonly employeeStore: EmployeeStore


    @action
    async submitNewNote(noteToCreate: INote, noteSource: NoteSource): Promise<boolean> {
        this.employeeStore.setAsyncPendingLockout(true)

        let submissionStatus = true
        try {
            // fill in any info the new note needs before submission
            noteToCreate.dateSubmitted = Utils.getFormattedDate()
            noteToCreate.submitter = this.employeeStore.root.sessionStore.currentUser.name
            if(noteToCreate.scope === NoteScope.CLIENT) {
                noteToCreate.attachedClientId = this.requestDetailStore.process.get("submitterId") as string
            }

            if(noteSource === NoteSource.PROJECT) {
                noteToCreate.projectId = String(this.requestDetailStore.project.get("Id"))
            } else if(noteSource === NoteSource.WORK) {
                noteToCreate.workId = String(this.requestDetailStore.work.get("Id"))
            }

            const addResult = await this.dataService.createNote(noteToCreate)
            noteToCreate.Id = addResult.data.Id // assign the assigned SP ID to the newly created note

            // if submission is successful, add the new note to the corresponding list
            runInAction(() => this.notes.unshift(noteToCreate))
            this.employeeStore.postMessage({messageText: "note successfully submitted", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.employeeStore.postMessage({messageText: "there was a problem submitting your note, try again", messageType: "error"})
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }

        return submissionStatus
    }

    @action
    async updateNote(noteToUpdate: INote, noteSource: NoteSource): Promise<boolean> {
        this.employeeStore.setAsyncPendingLockout(true)
        let submissionStatus = true
        try {
            noteToUpdate.dateSubmitted = Utils.getFormattedDate()
            await this.dataService.updateNote(noteToUpdate)

            // if submission is successful, add the new note to the corresponding list
            StoreUtils.replaceElementInListById(noteToUpdate, this.notes)
            this.employeeStore.postMessage({messageText: "note successfully updated", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.employeeStore.postMessage({messageText: "there was a problem updating your note, try again", messageType: "error"})
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }

        return submissionStatus
    }

    @action
    async deleteNote(noteToDelete: INote, noteSource: NoteSource): Promise<boolean> {
        this.employeeStore.setAsyncPendingLockout(true)
        let submissionStatus = true

        try {
            await this.dataService.deleteNote(noteToDelete.Id)

            // if deletion is successful, remove the new note from the corresponding list
            StoreUtils.removeELementInListById(noteToDelete, this.notes)
            this.employeeStore.postMessage({messageText: "note successfully deleted", messageType: "success"})
        } catch(error) {
            console.error(error)
            submissionStatus = false
            this.employeeStore.postMessage({messageText: "there was a problem deleting your note, try again", messageType: "error"})
        } finally {
            this.employeeStore.setAsyncPendingLockout(false)
        }
        return submissionStatus
    }
}
