import { IDataAccess } from "../dataAccess/IDataAccess"
import { IUser } from "../model/User"

export class AsyncService {
    constructor(
        private dao: IDataAccess,
    ) {}

    async fetchUser(): Promise<IUser> {
        const user: IUser = await this.dao.fetchUser()
        return user
    }
}
