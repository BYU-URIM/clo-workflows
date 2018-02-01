import { MockUsersDtos, MockProjects, MockProcesses, MockWorks } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUserDto, IUser } from "../model/User"
import { ICloRequestElement } from "../model/CloRequestElement"
import { deepCopy } from "../utils"

export class MockDataAccess implements IDataAccess {
  fetchClientProjects(): Promise<ICloRequestElement[]> {
    throw new Error("Method not implemented.")
  }

  fetchUser(): Promise<IUserDto> {
    return Promise.resolve(MockUsersDtos[0])
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
  fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>> {
    return Promise.resolve(null)
  }
}
