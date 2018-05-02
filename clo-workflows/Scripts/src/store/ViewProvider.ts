import { RootStore } from "./RootStore"

// defines parent-store view functionality so that child stores can consume view services agnostic to the parent-store
export interface IViewProvider {
    root: RootStore
    asyncPendingLockout: boolean
    postMessage(message: IMessage)
    setAsyncPendingLockout(val: boolean)
}

export interface IMessage {
    messageText: string,
    messageType: "error" | "success"
}
