export interface INote {
    submitter: string
    dateSubmitted: string
    text: string
    scope: NoteScope
    Id?: string // will be asigned to notes that have been submitted to the server
    workId?: string // present if source is a work
    projectId?: string // present if source is a project
    attachedClientId?: string // present if scope is client, will be changed to attachedDepartment when departments are implemented
}

/* EMPLOYEE SCOPE
    Employee scope notes are submitted by employees and can only be seen by other employees
    They are attached ONLY to a work or project - meaning tha either the projectId OR the workId will be filled in (not both)
    This means that these notes will appear on any process that reuses that work or project

   CLIENT SCOPE
    client scope notes are submitted by employees and clients. They are visible to both employees and clients   
    They are attached to EITHER a work and a clent / department OR a project and a client / department
    They will appear each time a client / department reuses the work / project
    They will not appear when other clients / departments reuse the work / project
*/
export enum NoteScope {
    EMPLOYEE = "employee",
    CLIENT = "client"
}

export enum NoteSource {
    PROJECT = "project",
    WORK = "work"
}

export function getEmptyNote(noteScope?: NoteScope): INote {
    return {
        submitter: null,
        dateSubmitted: null,
        text: "",
        scope: noteScope
    }
}
