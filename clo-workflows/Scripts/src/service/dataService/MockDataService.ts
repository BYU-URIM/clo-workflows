import { MockUsersDtos, MockProjects, MockProcesses, MockWorks, MockNotes } from "./MockData"
import { IUser, User, CloRequestElement, INote, NoteSource, NoteScope } from "../../model"
import Utils from "../../utils"
import { IDataService, ListName } from "./IDataService"
import { ItemAddResult } from "@pnp/sp"
import { getRole } from "../../model/loader/resourceLoaders"

export class MockDataService implements IDataService {
    searchWorksByTitle(searchTerm: string): Promise<CloRequestElement[]> {
        throw new Error("Method not implemented.")
    }
    searchProcessesByTitle(searchTerm: string): Promise<CloRequestElement[]> {
        throw new Error("Method not implemented.")
    }
    updateNote(note: INote): Promise<void> {
        throw new Error("Method not implemented.")
    }
    deleteNote(noteId: number): Promise<void> {
        throw new Error("Method not implemented.")
    }
    fetchWorks(): Promise<Array<CloRequestElement>> {
        return Promise.resolve(Utils.deepCopy(MockWorks))
    }
    fetchCurrentUserId() {
        throw new Error("Method not implemented.")
    }
    fetchClientProjects(): Promise<CloRequestElement[]> {
        return Promise.resolve(Utils.deepCopy(MockProjects))
    }

    fetchUser(): Promise<IUser> {
        const userDto = MockUsersDtos[0]
        const user = new User(userDto.name, userDto.username, userDto.email, userDto.Id, userDto.roleNames.map(roleName => getRole(roleName)))
        return Promise.resolve(user)
    }

    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<CloRequestElement>> {
        return Promise.resolve(Utils.deepCopy(MockProcesses))
    }

    fetchRequestElementsById(ids: number[], listName: ListName): Promise<CloRequestElement[]> {
        switch (listName) {
            case ListName.PROJECTS:
                return Promise.resolve(Utils.deepCopy(MockProjects.filter(project => ids.includes(project.Id as number))))
            case ListName.WORKS:
                return Promise.resolve(Utils.deepCopy(MockWorks.filter(work => ids.includes(work.Id as number))))
            case ListName.PROCESSES:
                return Promise.resolve(Utils.deepCopy(MockProcesses.filter(process => ids.includes(process.Id as number))))
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
        return Promise.resolve(Utils.deepCopy(MockProjects))
    }
    fetchClientProcesses(): Promise<Array<CloRequestElement>> {
        return Promise.resolve(Utils.deepCopy(MockProcesses))
    }

    fetchNotes(source: NoteSource, scope: NoteScope, sourceId: string, attachedClientId: string): Promise<Array<INote>> {
        return source === NoteSource.PROJECT
            ? Promise.resolve(Utils.deepCopy(MockNotes.filter(note => note.projectId === sourceId)))
            : Promise.resolve(Utils.deepCopy(MockNotes.filter(note => note.workId === sourceId)))
    }

    fetchClientNotes(userId: string): Promise<Array<INote>> {
        return Promise.resolve(Utils.deepCopy(MockNotes.filter(note => note.attachedClientId === userId)))
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
