import { observable, action, computed } from "mobx"

type Modal = "project" | "process" | null

export class ClientViewState {
    @observable private _projectId: string = undefined
    @observable private _projectType: string = undefined
    @observable private _workId: string = undefined
    @observable private _workType: string = undefined
    @observable private _workIsNew: boolean = undefined
    @observable private _asyncPendingLockout: boolean = false
    @observable private _modal: Modal = null
    @computed
    get modal(): Modal {
        return this._modal
    }
    set modal(value: Modal) {
        this._modal = value
    }

    @computed
    get projectId() {
        return this._projectId
    }
    set projectId(p) {
        this._projectId = p
    }
    @computed
    get projectType() {
        return this._projectType
    }
    set projectType(p) {
        this._projectType = p
    }
    @computed
    get workId() {
        return this._workId
    }
    set workId(p) {
        this._workId = p
    }
    @computed
    get workType() {
        return this._workType
    }
    set workType(p) {
        this._workType = p
    }

    @computed
    get asyncPendingLockout() {
        return this._asyncPendingLockout
    }
    set asyncPendingLockout(p) {
        this._asyncPendingLockout = p
    }
    @computed
    get workIsNew() {
        return this._workIsNew
    }
    set workIsNew(p) {
        this._workIsNew = p
    }

    @action
    resetClientState() {
        this._asyncPendingLockout = false
        this._projectId = undefined
        this._projectType = undefined
        this._workId = undefined
        this._workIsNew = false
        this._workType = undefined
        this._modal = null
    }
}
