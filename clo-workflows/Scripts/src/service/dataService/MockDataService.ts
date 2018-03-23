import { MockUsersDtos, MockProjects, MockProcesses, MockWorks, MockNotes } from "./MockData"
import { IRole } from "../../model/Role"
import { IUserDto, IUser, User } from "../../model/User"
import { CloRequestElement } from "../../model/CloRequestElement"
import { deepCopy } from "../../utils"
import { IDataService, ListName } from "./IDataService"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import { INote, NoteSource, NoteScope } from "../../model/Note"
import { getRole } from "../../model/loader/resourceLoaders"
import { ItemAddResult } from "sp-pnp-js/lib/pnp"
import { IKeyValueMap } from "mobx"

export class MockDataService implements IDataService {
    updateNote(note: INote): Promise<void> {
        throw new Error("Method not implemented.")
    }
    deleteNote(noteId: string): Promise<void> {
        throw new Error("Method not implemented.")
    }
    fetchWorks(): Promise<IKeyValueMap<string | number>[]> {
        throw new Error("Method not implemented.")
    }
    fetchCurrentUserId() {
        throw new Error("Method not implemented.")
    }
    fetchClientProjects(): Promise<CloRequestElement[]> {
        throw new Error("Method not implemented.")
    }

    fetchUser(): Promise<IUser> {
        const userDto = MockUsersDtos[0]
        const user = new User(
            userDto.name,
            userDto.username,
            userDto.email,
            userDto.Id,
            userDto.roleNames.map(roleName => getRole(roleName)),
        )
        return Promise.resolve(user)
    }

    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<CloRequestElement>> {
        return Promise.resolve(deepCopy(MockProcesses))
    }

    fetchRequestElementsById(ids: number[], listName: ListName): Promise<CloRequestElement[]> {
        switch (listName) {
            case ListName.PROJECTS:
                return Promise.resolve(deepCopy(MockProjects.filter(project => ids.includes(project.Id as number))))
            case ListName.WORKS:
                return Promise.resolve(deepCopy(MockWorks.filter(work => ids.includes(work.Id as number))))
            case ListName.PROJECTS:
                return Promise.resolve(deepCopy(MockProcesses.filter(process => ids.includes(process.Id as number))))
            default:
                return Promise.resolve([])
        }
    }

    createRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<CloRequestElement> {
        return Promise.resolve(null)
    }

    updateRequestElement(requestElement: CloRequestElement, listName: ListName): Promise<void> {
        return Promise.resolve(null)
    }

    fetchClientActiveProjects(client: IUser): Promise<Array<CloRequestElement>> {
        return Promise.resolve(deepCopy(MockProjects))
    }
    fetchClientProcesses(): Promise<Array<CloRequestElement>> {
        return Promise.resolve(deepCopy(MockProcesses))
    }

    fetchNotes(source: NoteSource, scope: NoteScope, sourceId: string, attachedClientId: string): Promise<Array<INote>> {
        return source === NoteSource.PROJECT
            ? Promise.resolve(deepCopy(MockNotes.filter(note => note.projectId === sourceId)))
            : Promise.resolve(deepCopy(MockNotes.filter(note => note.workId === sourceId)))
    }

    fetchClientCompletedProjects(): Promise<Array<CloRequestElement>> {
        return Promise.resolve([])
    }

    createNote(note: INote): Promise<ItemAddResult> {
        return Promise.resolve(null)
    }
    createProject(): Promise<ItemAddResult> {
        return
    }
    createProcess(): Promise<ItemAddResult> {
        return
    }
    createWork(): Promise<ItemAddResult> {
        return
    }
}
