import { IGroup, IGroupDividerProps } from "office-ui-fabric-react"
import { ClientViewState, ClientStoreData } from "../../store"

export * from "./ProjectProcessList"

export interface IColumns {
    key: string
    name: string
    fieldName: string
    minWidth: number
    maxWidth: number
    isResizable: boolean
}
export interface IProjectGroup extends IGroup {
    submitterId: string
    Title?: string
    projectId: string
    type: string
}
export interface ICustomGroup extends IGroup {
    projectId: string
}
export interface IProjectProcessListProps {
    asyncPendingLockout: boolean
    handleSubmit(projectId: string): void
    view: ClientViewState
    data: ClientStoreData
}
export interface ICustomGroupDividerProps extends IGroupDividerProps {
    group: ICustomGroup
}
