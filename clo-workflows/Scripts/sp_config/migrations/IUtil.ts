import { IPnpNodeSettings } from "sp-pnp-node/dist"

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
export interface IDBConfig {
    defaultTables: Array<string>
    tables: ITable
}
