import { IKeyValueMap } from "mobx"
// Request Element is a process, project, or work
// it is a plain javascript object sent from the server containing form data
// an alternate and identical definition would be interface CloRequestElement {[field: string]: FormEntryType}
export type CloRequestElement = IKeyValueMap<FormEntryType>

// ensures that values of a CloRequestElement are serializable primitive values (no functions or nested objects)
export type FormEntryType = string | number

// TODO should these be in JSON??
export const WORK_TYPES = ["Music", "Book", "Article", "Book Chapter", "Image", "Video", "Website", "Other", "Musical Work"]

export const PROJECT_TYPES = ["Synch", "Arranging", "Masters", "Grand", "Theatrical", "Movies", "Images"]
