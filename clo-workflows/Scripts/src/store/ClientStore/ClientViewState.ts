import { observable, action, computed } from "mobx"
import { ClientRequest } from ".."
import { NoteSource } from "../../model/"

type Modal = "project" | "process" | null

export class ClientViewState {
    @observable private _asyncPendingLockout: boolean = false
    @observable private _modal: Modal = null
    @observable project: ClientRequest = new ClientRequest()
    @observable process: ClientRequest = new ClientRequest()
    @observable work: ClientRequest = new ClientRequest()
    @observable note: ClientRequest = new ClientRequest()
    @observable private _notesType: NoteSource = undefined

    @computed
    get notesType(): NoteSource {
        return this._notesType
    }
    set notesType(val: NoteSource) {
        this._notesType = val
    }
    @computed
    get modal(): Modal {
        return this._modal
    }
    set modal(value: Modal) {
        this._modal = value
    }
    @computed
    get asyncPendingLockout() {
        return this._asyncPendingLockout
    }
    set asyncPendingLockout(p) {
        this._asyncPendingLockout = p
    }

    @computed
    get notesTitle() {
        return this.notesType === NoteSource.WORK ? "Work Notes" : "Projects Notes"
    }
    @action
    resetClientState() {
        this.asyncPendingLockout = false
        this.modal = null
        this.project = new ClientRequest()
        this.process = new ClientRequest()
        this.work = new ClientRequest()
        this.note = new ClientRequest()
    }
}
