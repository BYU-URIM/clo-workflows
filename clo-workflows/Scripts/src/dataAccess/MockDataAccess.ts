import { MockUsersDtos, MockProjects, MockProcesses, MockWorks, MockNotes } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUserDto, IUser } from "../model/User"
import { ICloRequestElement } from "../model/CloRequestElement"
import { deepCopy } from "../utils"
import { INote } from "../model/Note"

export class MockDataAccess implements IDataAccess {

    fetchUser(): Promise<IUserDto> {
        return Promise.resolve(MockUsersDtos[1])
    }

    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProcesses))
    }

    fetchEmployeeActiveProjects(employee: IUser): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProjects))
    }

    fetchEmployeeActiveWorks(employee: IUser): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockWorks))
    }

    fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProjects))
    }

    fetchProjectNotes(projectId: number): Promise<Array<INote>> {
        return Promise.resolve(deepCopy(MockNotes.filter(note => note.projectId === projectId)))
    }

    fetchWorkNotes(workId: number): Promise<Array<INote>> {
        return Promise.resolve(deepCopy(MockNotes.filter(note => note.workId === workId)))
    }
}
