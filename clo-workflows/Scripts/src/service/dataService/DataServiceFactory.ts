import { ENVIRONMENT, EnvType } from "../../env"
import { IDataService, SpDataService, MockDataService } from "./"
import { DB_CONFIG } from "../../../res/"
import Utils from "../../utils"

// static utitlity class for creating data service objects
// contains logic for creating a SPDataAccess or MockDataAccess depending on the environment

export class DataServiceFactory {
    static getDataService(): IDataService {
        return ENVIRONMENT === EnvType.LOCAL
            ? new MockDataService()
            : ENVIRONMENT === EnvType.SHAREPOINT
                ? new SpDataService(Utils.getQueryStringParameter("SPAppWebUrl"), Utils.getQueryStringParameter("SPHostUrl"))
                : ENVIRONMENT === EnvType.SHAREPOINT_PROXY
                    ? new SpDataService(document.URL, DB_CONFIG["hostUrl"])
                    : null
    }
}
