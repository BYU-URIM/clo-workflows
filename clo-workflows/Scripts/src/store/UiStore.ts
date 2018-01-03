import { RootStore } from "./RootStore"
import { AsyncService } from "../service/AsyncService"

export class UiStore {
    constructor(
        private root: RootStore,
    ) {}
}
