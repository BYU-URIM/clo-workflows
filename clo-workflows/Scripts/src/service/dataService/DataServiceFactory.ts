import { ENVIRONMENT, EnvType } from "../../env"
import { MockDataService } from "./MockDataService"
import { SpDataService } from "./SpDataService"
import { IDataService } from "./IDataService"

// static utitlity class for creating data service objects
// contains logic for creating a SPDataAccess or MockDataAccess depending on the environment

export class DataServiceFactory {
    // creates and returns a data access object
    static getDataService(): IDataService {
        if (ENVIRONMENT === EnvType.LOCAL) {
            return new MockDataService()
        } else if (ENVIRONMENT === EnvType.SHAREPOINT) {
            return new SpDataService()
        } else {
            return null
        }
    }

    private constructor() {} // static utility class; won't be constructed
}
