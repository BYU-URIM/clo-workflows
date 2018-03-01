import { IUser, IUserDto } from "../../model/User"
import { ICloRequestElement } from "../../model/CloRequestElement"
import { deepCopy, getQueryStringParameter } from "../../utils"
import { IFormControl } from "../../model/FormControl"
import { IView } from "../../model/View"
import { IDataService, ListName } from "./IDataService"
import * as pnp from "sp-pnp-js"
import { Web } from "sp-pnp-js/lib/sharepoint/webs"
import { IRole } from "../../model/Role"
import { getRole } from "../../model/loader/resourceLoaders"
import { INote } from "../../model/Note"
import { ODataDefaultParser } from "sp-pnp-js"
import * as DB_CONFIG from "../../../res/json/DB_CONFIG.json"
import { debug } from "util"

// abstraction used to acess the SharePoint REST API
// should only be used when the app is deployed against a SharePoint Instance conforming to the schema defined in "res/json/DB_CONFIG.json"

window["pnp"] = pnp
export class SpDataService implements IDataService {
    fetchEmployeeActiveWorks(employee: IUser): Promise<ICloRequestElement[]> {
        throw new Error("Method not implemented.")
    }
    constructor(appWebUrl: string, hostWebUrl: string) {
        this.APP_WEB_URL = appWebUrl
        this.HOST_WEB_URL = hostWebUrl
        this.cloRequestElementParser = new CloRequestElementParser()
    }

    /*******************************************************************************************************/
    // IDataService interface implementation
    async fetchUser(): Promise<IUser> {
        const rawUser = await this.getAppWeb().currentUser.get()
        const rawRoles: any[] = await this.getAppWeb()
            .siteUsers.getById(rawUser.Id)
            .groups.get()

        // TODO support multiple roles instead of using only roleNames[0] ?
        // const rawRole: any = (rawRoles.length && rawRoles[2]) || { Title: "Anonymous"}
        const rawRole: any = { Title: "Anonymous" }

        const userName = this.extractUsernameFromLoginName(rawUser.LoginName)
        // build user object from userDto and role
        return {
            name: rawUser.Title,
            username: userName,
            email: rawUser.Email,
            role: getRole(rawRole.Title),
        }
    }
    async fetchCurrentUserId(){
        let currentUserId = await this.getAppWeb().currentUser.get()
        return currentUserId.UserId.NameId
    }

    // TODO add filter string to query for smaller requests and filtering on the backend
    async fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        const activeProcesses: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(ListName.PROCESSES)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get(this.cloRequestElementParser)

        const permittedStepNames = employee.role.permittedSteps.map(step => step.name)
        return activeProcesses.filter(item => {
            return permittedStepNames.includes(item.step as string)
        })
    }

    async fetchRequestElementsById(ids: number[], listName: ListName): Promise<ICloRequestElement[]> {
        const projects: Array<ICloRequestElement> = []
        const batch = this.getHostWeb().createBatch()
        for (const id of ids) {
            const project = await this.getHostWeb()
                .lists.getByTitle(listName)
                .items.getById(id)
                /*.inBatch(batch)*/ .get(this.cloRequestElementParser)
            projects.push(project)
        }
        // await batch.execute()
        return projects
    }

    async createRequestElement(requestElement: ICloRequestElement, listName: ListName): Promise<ICloRequestElement> {
        const result = await this.getHostWeb()
            .lists.getByTitle(listName)
            .items.add(requestElement)
        return result.data
    }

    async updateRequestElement(requestElement: ICloRequestElement, listName: ListName): Promise<void> {
        await this.getHostWeb()
            .lists.getByTitle(listName)
            .items.getById(requestElement.Id as number)
            .update(requestElement)
    }

    async fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>> {
        const activeProjects: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(ListName.PROJECTS)
            .items.get(this.cloRequestElementParser)

        return activeProjects.filter(item => item.submitter === client.name)
    }

    async fetchProjectNotes(projectId: number): Promise<Array<INote>> {
        return await this.getHostWeb()
            .lists.getByTitle(ListName.NOTES)
            .items.filter(`projectId eq '${projectId}'`)
            .get(this.cloRequestElementParser)
    }

    async fetchWorkNotes(workId: number): Promise<Array<INote>> {
        return await this.getHostWeb()
            .lists.getByTitle(ListName.NOTES)
            .items.filter(`workId eq '${workId}'`)
            .get(this.cloRequestElementParser)
    }

    async fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

    async fetchClientProjects(): Promise<Array<ICloRequestElement>> {
        let clientProjects: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(ListName.PROJECTS).items.get()        
        return clientProjects

    }
    async fetchClientProcesses(client: IUser): Promise<Array<ICloRequestElement>> {
        const activeProcesses: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(ListName.PROCESSES)
            .items
            .get(this.cloRequestElementParser)

        const permittedStepNames = client.role.permittedSteps.map(step => step.name)
        return activeProcesses
    }

    /******************************************************************************************************/
    // helper data and methods
    private readonly ACTIVE_FILTER_STRING: string = "step ne 'complete'"
    private readonly HOST_WEB_URL: string
    private readonly APP_WEB_URL: string
    private readonly cloRequestElementParser: CloRequestElementParser

    private getAppWeb(): Web {
        return pnp.sp.configure(
            {
                headers: { Accept: "application/json; odata=verbose" },
                credentials: "same-origin",
            },
            "../",
        ).web
    }

    private getHostWeb(): Web {
        return pnp.sp
            .configure(
                {
                    headers: { Accept: "application/json; odata=verbose" },
                    credentials: "same-origin",
                },
                "../",
            )
            .crossDomainWeb(this.APP_WEB_URL, this.HOST_WEB_URL)
    }

    // the loginName string returned form the server contains some garbage appended to the username - take it out here
    private extractUsernameFromLoginName(loginName: string): string {
        if (loginName.includes("\\")) {
            return loginName.split("\\")[1]
        } else if (loginName.includes("|")) {
            return loginName.split("|")[1]
        } else return ""
    }
    

}

// This custom parser filters out irrelevant fields and metadata from SharePoint REST responses to WORK, PROCESS, PROJECT, and NOTE queries
// Only fields that are part of a CLO process, project, or request (as defined in res/DB_CONFIG.json) are preserved
export class CloRequestElementParser extends ODataDefaultParser {
    public constructor() {
        super()
        const tableNames = Object.keys(DB_CONFIG["tables"])
        this.cloFieldSet = tableNames.reduce((curFieldSet: Set<string>, tableName: string) => {
            const table = DB_CONFIG["tables"][tableName]
            table.fields.forEach((fieldName: string) => curFieldSet.add(fieldName))
            return curFieldSet
        }, new Set())
        this.cloFieldSet.add(DB_CONFIG["defaultFields"])
    }

    // set storing all fields specified in all tables of DB_CONFIG (as well as fields specified in DB_CONFIG.defaultFields)
    // a set is used because it prevents duplicates (there are many field duplicates among the various tables), and because it provides fast lookup
    private cloFieldSet: Set<string>

    // this method is called automatically by PNP once for each request
    public async parse(response: Response): Promise<any> {
        // the ODataDefaultParser base method returns a JSON with all fields for the given list - a mix of CLO fields and garbage SP metadata fields
        const parsedResponse = await super.parse(response)

        // the parsedResponse may be an array of response objects or a single object, depending on what was requested
        if (Array.isArray(parsedResponse)) {
            return parsedResponse.map((singleResponseObject: {}) => this.filterSpResponseObject(singleResponseObject))
        } else if (typeof parsedResponse === "object") {
            return this.filterSpResponseObject(parsedResponse)
        } else {
            console.log("custom SpDataParser was unable to handle the data type of the response")
            return parsedResponse
        }
    }

    // this method filters out all fields that are not defined in the cloFieldSet
    private filterSpResponseObject(spResponseObject: {}): {} {
        return Object.keys(spResponseObject).reduce((filteredResponseObject: {}, spReponseFieldName: string) => {
            if (this.cloFieldSet.has(spReponseFieldName)) {
                filteredResponseObject[spReponseFieldName] = spResponseObject[spReponseFieldName]
            }
            return filteredResponseObject
        }, {})
    }
}
