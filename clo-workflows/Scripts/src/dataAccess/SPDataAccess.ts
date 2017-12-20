import { IDataAccess } from "./IDataAccess"

export class SPDataAccess implements IDataAccess {

    public fetchUser() {
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
