import { IKeyValueMap } from "mobx"
import * as VIEWS from "../../res/json/form_templates/VIEWS.json"
// Request Element is a process, project, or work
// it is a plain javascript object sent from the server containing form data
// an alternate and identical definition would be interface CloRequestElement {[field: string]: FormEntryType}
// note values in a CloRequestElement will be strings, besides the Id assigned by SharePoint
export type CloRequestElement = IKeyValueMap<FormEntryType> & IdentifiableObject

export interface IdentifiableObject {
    Id?: number // request elements will be assigned numbers once they are saved to the SharePoint server
}

// ensures that values of a CloRequestElement are serializable primitive values (no functions or nested objects)
export type FormEntryType = string | number

// TODO should these be in JSON??
export const WORK_TYPES = Object.keys(VIEWS).filter(view => VIEWS[view].dataSource === "works")

// export const PROJECT_TYPES = ["Synch", "Arranging", "Masters", "Grand", "Theatrical", "Movies", "Images"]
export const PROJECT_TYPES = Object.keys(VIEWS).filter(view => VIEWS[view].dataSource === "projects")
