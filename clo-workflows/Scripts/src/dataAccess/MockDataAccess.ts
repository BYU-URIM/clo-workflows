import { IDataAccess } from "./IDataAccess"

export class MockDataAccess implements IDataAccess {
    public fetchUser() {
        return Promise.resolve("user")
    }
}
