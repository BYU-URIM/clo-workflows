import { IDataAccess } from "./IDataAccess"
import { ENVIRONMENT, EnvType } from "../env"
import { MockDataAccess } from "./MockDataAccess"
import { SPDataAccess } from "./SPDataAccess"

// static utitlity class for creating data access objects
// contains logic for creating a SPDataAccess or MockDataAccess depending on the environment

export class DataAccessFactory {

    // creates and returns a data access object
    static getDao(): IDataAccess {
        if(ENVIRONMENT === EnvType.LOCAL) {
            return new MockDataAccess()
        } else if(ENVIRONMENT === EnvType.SHAREPOINT) {
            return new SPDataAccess()
        } else {
            return null
        }
    }

    private constructor() {} // static utility class; won't be constructed
}
