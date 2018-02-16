import { MockUsersDtos, MockProjects, MockProcesses, MockWorks, MockNotes } from "./MockData"
import { IRole } from "../../model/Role"
import { IUserDto, IUser } from "../../model/User"
import { ICloRequestElement } from "../../model/CloRequestElement"
import { deepCopy } from "../../utils"
import { IDataService } from "./IDataService"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import { INote } from "../../model/Note"

export class MockDataService implements IDataService {
    fetchClientProjects(): Promise<ICloRequestElement[]> {
        throw new Error("Method not implemented.")
    }

    fetchUser(): Promise<IUser> {
        const userDto = MockUsersDtos[0]
        const role = {
            name: userDto.roleName,
            permittedSteps: ROLES[userDto.roleName].permittedSteps.map(stepName => deepCopy(STEPS[stepName]))
        }
        return Promise.resolve({ ...userDto, role })
    }

    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProcesses))
    }

    fetchProjectsById(ids: number[]): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProjects.filter(project => ids.includes(project.Id as number))))
    }

    fetchWorksById(ids: number[]): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockWorks.filter(project => ids.includes(project.Id as number))))
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

    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }
}
