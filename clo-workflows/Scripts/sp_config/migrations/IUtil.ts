import { IPnpNodeSettings } from "sp-pnp-node"

export interface ITable {
    title: string
    fields: Array<string>
}

export interface IUtil {
    pnpNodeSettings: IPnpNodeSettings
    config?: any
    data: IData
}

export interface IData {
    proposedLists: Array<string>
    currentListTitles: Array<string>
    missingLists: Array<string>
}
export interface IGroup {
    name: string
    members?: Array<string>
}
export interface IDBConfig {
    hostUrl: string
    defaultTables: string[]
    defaultFields: string[]
    groups: Array<IGroup>
    tables: ITables
}

interface ITables {
    processes: IProcesses
    projects: IProcesses
    works: IProcesses
    notes: IProcesses
}

interface IProcesses {
    type: string
    fields: string[]
}
