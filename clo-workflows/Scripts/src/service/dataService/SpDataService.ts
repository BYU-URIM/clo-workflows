import { IUser, IUserDto } from "../../model/User"
import { ICloRequestElement } from "../../model/CloRequestElement"
import { deepCopy } from "../../utils"
import { IFormControl } from "../../model/FormControl"
import { IView } from "../../model/View"
import { IDataService } from "./IDataService"
import * as DB_CONFIG from "../../../res/json/DB_CONFIG.json"
import * as pnp from "sp-pnp-js"
import { Web } from "sp-pnp-js/lib/sharepoint/webs"
import { IRole } from "../../model/Role"
import { getRole } from "../../model/loader/resourceLoaders"

export class SpDataService implements IDataService {

    /*******************************************************************************************************/
    // IDataService interface implementation
    async fetchUser(): Promise<IUser> {
        const rawUser = await this.getAppWeb().currentUser.get()
        const roleNames = await this.getAppWeb().siteUsers.getById(rawUser.Id).groups.get()
        
        // TODO support multiple roles instead of using only roleNames[0] ?
        const roleName = (roleNames.length && roleNames[0]) || "Anonymous"

        // build user object from userDto and role
        return {
            name: rawUser.Title,
            username: rawUser.LoginName,
            email: rawUser.Email,
            role: getRole(roleName),
        }
    }

    async fetchEmployeeActiveProjects(employee: IUser): Promise<Array<ICloRequestElement>> {
        const activeProjects: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(this.PROCESS_LIST_NAME)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get()

        const permittedStepNames = employee.role.permittedSteps.map(step => step.name)
        return activeProjects.filter(item => {
            permittedStepNames.includes(item.step as string)
        })
    }

    // TODO add filter string to query for smaller requests and filtering on the backend
    async fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        const activeProcesses: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(this.PROCESS_LIST_NAME)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get()

        const permittedStepNames = employee.role.permittedSteps.map(step => step.name)
        return activeProcesses.filter(item => {
            permittedStepNames.includes(item.step as string)
        })
    }

    async fetchEmployeeActiveWorks(employee: IUser): Promise<Array<ICloRequestElement>> {
        const activeWorks: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(this.WORKS_LIST_NAME)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get()

        const permittedStepNames = employee.role.permittedSteps.map(step => step.name)
        return activeWorks.filter(item => {
            permittedStepNames.includes(item.step as string)
        })
    }

    async fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>> {
        const activeProjects: Array<ICloRequestElement> = await this.getHostWeb()
            .lists.getByTitle(this.PROJECT_LIST_NAME)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get()

        return activeProjects.filter(item => item.submitter === client.name)
    }

    fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }

    
    fetchClientProjects(): Promise<Array<ICloRequestElement>> {
        return Promise.resolve(null)
    }


    /*******************************************************************************************************/
    // helper data and methods
    private readonly PROCESS_LIST_NAME: string = "processes"
    private readonly PROJECT_LIST_NAME: string = "projects"
    private readonly WORKS_LIST_NAME: string = "works"
    private readonly NOTES_LIST_NAME: string = "notes"
    private readonly ACTIVE_FILTER_STRING: string = "Step neq 'complete'"
    private readonly HOST_WEB_URL = DB_CONFIG["hostUrl"]

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
            .crossDomainWeb("../", this.HOST_WEB_URL)
    }
}
