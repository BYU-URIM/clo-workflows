import { IDataAccess } from "./IDataAccess"
import { ICloRequestElement } from "../model/CloRequestElement"

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

    fetchEmployeeActiveProcesses(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

    fetchEmployeeActiveProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

    fetchEmployeeActiveWorks(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

    fetchClientActiveProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

}
