import { ClientStoreData, ClientViewState } from "./index"
import { computed } from "mobx"

export class ComputableState {
    constructor(private _view: ClientViewState, private _data: ClientStoreData) {}
    @computed
    get selectedNotes() {
        const actualNotes = this._data.notes.filter(n => n.length > 0).reduce((prev, curr) => prev.concat(curr))

        return actualNotes.filter(
            a =>
                a.workId ===
                this._data.processes.filter(p => {
                    return p.Id.toString() === this._view.process.id
                })[0].workId
        )
    }
}
