import { MockUsersDtos, MockProjects, MockProcesses, MockWorks } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUserDto } from "../model/User"
import { ICloRequestElement } from "../model/CloRequestElement"
import { deepCopy } from "../utils"

export class MockDataAccess implements IDataAccess {

    fetchUser(): Promise<IUserDto> {
        return Promise.resolve(MockUsersDtos[1])
    }

    fetchEmployeeActiveProcesses(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProcesses))
    }

    fetchEmployeeActiveProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProjects))
    }

    fetchEmployeeActiveWorks(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockWorks))
    }

    fetchClientProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(deepCopy(MockProjects))
    }
    fetchClientCompletedProjects():Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }
}
