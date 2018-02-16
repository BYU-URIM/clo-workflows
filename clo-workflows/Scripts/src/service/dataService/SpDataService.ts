import { IUser, IUserDto } from "../../model/User"
import { ICloRequestElement } from "../../model/CloRequestElement"
import { deepCopy, getQueryStringParameter } from "../../utils"
import { IFormControl } from "../../model/FormControl"
import { IView } from "../../model/View"
import { IDataService } from "./IDataService"
import * as pnp from "sp-pnp-js"
import { Web } from "sp-pnp-js/lib/sharepoint/webs"
import { IRole } from "../../model/Role"
import { getRole } from "../../model/loader/resourceLoaders"
import { INote } from "../../model/Note"

// abstraction used to acess the SharePoint REST API
// should only be used when the app is deployed against a SharePoint Instance conforming to the schema defined in "res/json/DB_CONFIG.json"
export class SpDataService implements IDataService {
    constructor(appWebUrl: string, hostWebUrl: string) {
        this.APP_WEB_URL = appWebUrl
        this.HOST_WEB_URL = hostWebUrl
    }

    /*******************************************************************************************************/
    // IDataService interface implementation
    async fetchUser(): Promise<IUser> {
        const rawUser = await this.getAppWeb().currentUser.get()
        const rawRoles: any[] = await this.getAppWeb().siteUsers.getById(rawUser.Id).groups.get()
        
        // TODO support multiple roles instead of using only roleNames[0] ?
        const rawRole: any = (rawRoles.length && rawRoles[0]) || "Anonymous"

        const userName = this.extractUsernameFromLoginName(rawUser.LoginName)

        // build user object from userDto and role
        return {
            name: rawUser.Title,
            username: userName,
            email: rawUser.Email,
            role: getRole(rawRole.Title),
        }
    }


    // TODO add filter string to query for smaller requests and filtering on the backend
    async fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        const activeProcesses: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(this.PROCESS_LIST_NAME)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get()

        const permittedStepNames = employee.role.permittedSteps.map(step => step.name)
        return activeProcesses.filter(item => {
            return permittedStepNames.includes(item.step as string)
        })
    }

    async fetchProjectsById(ids: number[]): Promise<Array<ICloRequestElement>> {
        const projects: Array<ICloRequestElement> = []
        const batch = this.getHostWeb().createBatch()
        for(const id of ids) {
            const project = await this.getHostWeb()
                .lists.getByTitle(this.PROJECT_LIST_NAME)
                .items.getById(id)
                /*.inBatch(batch)*/.get()
            projects.push(project)
        }
        // await batch.execute()
        return projects
    }

    async fetchWorksById(ids: number[]): Promise<Array<ICloRequestElement>> {
        const works: Array<ICloRequestElement> = []
        const batch = this.getHostWeb().createBatch()
        for(const id of ids) {
            const project = await this.getHostWeb()
                .lists.getByTitle(this.WORK_LIST_NAME)
                .items.getById(id)
                /*.inBatch(batch)*/.get()
            works.push(project)
        }
        // await batch.execute()
        return works
    }

    async fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>> {
        const activeProjects: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(this.PROJECT_LIST_NAME)
            .items.get()

        return activeProjects.filter(item => item.submitter === client.name)
    }

    fetchProjectNotes(projectId: number): Promise<Array<INote>> {
        return this.getHostWeb()
            .lists.getById(this.NOTES_LIST_NAME)
            .items.filter(`projectId eq '${projectId}'`)
            .get()
    }

    fetchWorkNotes(workId: number): Promise<Array<INote>> {
        return this.getHostWeb()
            .lists.getById(this.NOTES_LIST_NAME)
            .items.filter(`workId eq '${workId}'`)
            .get()
    }

    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

    
    fetchClientProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }


    /******************************************************************************************************/
    // helper data and methods
    private readonly PROCESS_LIST_NAME: string = "processes"
    private readonly PROJECT_LIST_NAME: string = "projects"
    private readonly WORK_LIST_NAME: string = "works"
    private readonly NOTES_LIST_NAME: string = "notes"
    private readonly ACTIVE_FILTER_STRING: string = "step ne 'complete'"
    private readonly HOST_WEB_URL: string
    private readonly APP_WEB_URL: string

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
        if(loginName.includes("\\")) {
            return loginName.split("\\")[1]
        } else if(loginName.includes("|")) {
            return loginName.split("|")[1]
        } else return ""
    }
}
