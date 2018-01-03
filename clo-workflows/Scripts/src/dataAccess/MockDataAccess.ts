import { MockUsersDtos } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUserDto } from "../model/User"

export class MockDataAccess implements IDataAccess {

    fetchUser(): Promise<IUserDto> {
        return Promise.resolve(MockUsersDtos[0])
    }
}
