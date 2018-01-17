// ensures that values of a CloRequestElement are serializable primitive values (no functions or nested objects)
export type FormEntryType = string | number | boolean

// Request Element is a process, project, or work
// it is a plain javascript object sent from the server containing form data
export interface ICloRequestElement {
    [field: string]: FormEntryType
}
