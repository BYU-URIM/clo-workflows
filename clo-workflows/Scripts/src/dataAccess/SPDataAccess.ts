import { IDataAccess } from "./IDataAccess"

export class SPDataAccess implements IDataAccess {

    fetchUser() {
        return fetch("../_api/web/currentuser")
            .then(res => res.json())
            .then(data => ({
                name: data.d.Title,
                email: data.d.Email,
                username: data.d.LoginName,
                role: null,
            }))
    }
    fetchUserRole() {
        return fetch("../_api/web/currentuser")
            .then(res => res.json())
            .then(data => ({
                name: data.d.Title,
                email: data.d.Email,
                username: data.d.LoginName,
                role: null,
            }))
    }
}
