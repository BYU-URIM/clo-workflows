import { MockUsersDtos, MockProjects } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUserDto } from "../model/User"
import { IRequestElement } from "../model/RequestElement"

export class MockDataAccess implements IDataAccess {

    fetchUser(): Promise<IUserDto> {
        return Promise.resolve(MockUsersDtos[0])
    }

    fetchEmployeeActiveProjects(): Promise<Array<IRequestElement>> {
        return Promise.resolve(MockProjects)
    }

    fetchClientActiveProjects(): Promise<Array<IRequestElement>> {
        return Promise.resolve(MockProjects)
    }
}
