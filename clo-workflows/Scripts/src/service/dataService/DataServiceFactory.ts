import { ENVIRONMENT, EnvType } from "../../env"
import { MockDataService } from "./MockDataService"
import { SpDataService } from "./SpDataService"
import { IDataService } from "./IDataService"
import Utils from "../../utils"
import * as DB_CONFIG from "../../../res/json/DB_CONFIG.json"

// static utitlity class for creating data service objects
// contains logic for creating a SPDataAccess or MockDataAccess depending on the environment

export class DataServiceFactory {
    // creates and returns a data access object
    static getDataService(): IDataService {

        if (ENVIRONMENT === EnvType.LOCAL) {
            // for a local deployment against a local data source, construct the mock data service
            return new MockDataService()
        } else if (ENVIRONMENT === EnvType.SHAREPOINT) {
            // for a remote sharepoint deployment, construct the data service with
            // appWebUrl and hostWebUrl taken from the query parameters of URL
            return new SpDataService(Utils.getQueryStringParameter("SPAppWebUrl"), Utils.getQueryStringParameter("SPHostUrl"))
        } else if(ENVIRONMENT === EnvType.SHAREPOINT_PROXY) {
            // for a local sharepoint deployement against the api of a remote sharepoint instance, the app web url
            // is the local url (e.g. https://localhost:8080) and the host url needs to be the host of the remote SP instanc
            return new SpDataService(document.URL, DB_CONFIG["hostUrl"])
        } else {
            return null
        }
    }

    private constructor() {} // static utility class; won't be constructed
}
