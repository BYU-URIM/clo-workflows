import { IDataAccess } from "./IDataAccess"
import { IRequestElement } from "../model/RequestElement"

export class SPDataAccess implements IDataAccess {

    fetchUser() {
        return fetch("../_api/web/currentuser")
            .then(res => res.json())
            .then(data => ({
                name: data.d.Title,
                email: data.d.Email,
                username: data.d.LoginName,
                roleName: data.d.Group,
            }))
    }

    fetchEmployeeActiveProjects(): Promise<Array<IRequestElement>> {
        return Promise.resolve(null)
    }
    fetchClientActiveProjects(): Promise<Array<IRequestElement>> {
        return Promise.resolve(null)
    }

}
