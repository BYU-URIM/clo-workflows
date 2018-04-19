import { RootStore } from "./RootStore"

export interface IViewProvider {
    root: RootStore
    postMessage(message: IMessage)
    setAsyncPendingLockout(val: boolean)
}

export interface IMessage {
    messageText: string,
    messageType: "error" | "success"
}
