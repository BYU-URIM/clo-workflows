import { IDataAccess } from "./IDataAccess"

export class SPDataAccess implements IDataAccess {
    public fetchUser() {
        return Promise.resolve("user")
    }
}
