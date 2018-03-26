import { observable } from "mobx"

export class View {
    @observable projectId: string = undefined
    @observable projectType: string = undefined
    @observable workId: string = undefined
    @observable workType: string = undefined
    @observable showProjectModal: boolean = undefined
    @observable showProcessModal: boolean = undefined
    @observable workIsNew: boolean = undefined
    @observable asyncPendingLockout: boolean = undefined
}
