import { IDataAccess } from "../dataAccess/IDataAccess"
import { DataAccessFactory } from "../dataAccess/DataAccessFactory"
import { IUser } from "../model/User"

export class AsyncService {
    // data access object
    private dao: IDataAccess = DataAccessFactory.getDao()

    public async fetchUser(): Promise<IUser> {
        const user: IUser = await this.dao.fetchUser()
        return user
    }
}
