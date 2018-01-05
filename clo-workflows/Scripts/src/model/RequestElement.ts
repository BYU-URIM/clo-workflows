export type FormEntryType = string | number | boolean

// Request Element is a process, project, or work
// it is a plain javascript object sent from the server containing form data
export interface IRequestElement {
    [field: string]: FormEntryType
}
