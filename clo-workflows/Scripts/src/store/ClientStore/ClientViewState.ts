import { observable, action, computed } from "mobx"
import { ClientRequest } from "./index"

type Modal = "project" | "process" | null

export class ClientViewState {
    @observable private _asyncPendingLockout: boolean = false
    @observable private _modal: Modal = null
    @observable project: ClientRequest = new ClientRequest()
    @observable process: ClientRequest = new ClientRequest()
    @observable work: ClientRequest = new ClientRequest()
    @observable note: ClientRequest = new ClientRequest()

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
    @action
    resetClientState() {
        this._asyncPendingLockout = false
        this._modal = null
        this.project = new ClientRequest()
        this.process = new ClientRequest()
        this.work = new ClientRequest()
        this.note = new ClientRequest()
    }
}
