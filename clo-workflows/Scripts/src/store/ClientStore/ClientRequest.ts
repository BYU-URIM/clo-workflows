import { observable, action, computed } from "mobx"
export class ClientRequest {
    @observable private _id: string = undefined
    @observable private _type: string = undefined
    @observable private _isNew: boolean = undefined

    @computed
    get id(): string {
        return this._id
    }

    set id(value: string) {
        this._id = value
    }

    @computed
    get type(): string {
        return this._type
    }

    set type(value: string) {
        this._type = value
    }

    @computed
    get isNew(): boolean {
        return this._isNew
    }

    set isNew(value: boolean) {
        this._isNew = value
    }
}
