import { IDataAccess } from "./IDataAccess"
import { ICloRequestElement } from "../model/CloRequestElement"
import * as pnp from "sp-pnp-js"
import { IUserDto, IUser } from "../model/User"
import { SPRest } from "sp-pnp-js/lib/sharepoint/rest"
import { Web } from "sp-pnp-js/lib/sharepoint/webs"
import * as DB_CONFIG from "../../res/json/DB_CONFIG.json"
import { INote } from "../model/Note"

export class SPDataAccess implements IDataAccess {

    async fetchUser(): Promise<IUserDto> {
        const spUser = await this.getAppWeb().currentUser.get()
        const roleNames = await this.getAppWeb().siteUsers.getById(spUser.Id).groups.get()

        return {
            name: spUser.Title,
            email: spUser.Email,
            username: spUser.LoginName,
            roleName: (roleNames.length && roleNames[0]) || "Anonymous"
        }
    }

    // TODO add filter string to query for smaller requests and filtering on the backend
    fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        return this.getHostWeb().lists
            .getByTitle(this.PROCESS_LIST_NAME)
            .items
            .filter(this.ACTIVE_FILTER_STRING)
            .get()
            .then((data: Array<ICloRequestElement>) => data.filter(item => {
                employee.role.permittedSteps.map(step => step.name).includes(item.step as string)
            }))
    }

    fetchEmployeeActiveProjects(employee: IUser): Promise<Array<ICloRequestElement>> {
        return this.getHostWeb().lists
            .getByTitle(this.PROJECT_LIST_NAME)
            .items
            .filter(this.ACTIVE_FILTER_STRING)
            .get()
            .then((data: Array<ICloRequestElement>) => data.filter(item => {
                employee.role.permittedSteps.map(step => step.name).includes(item.step as string)
            }))
    }

    fetchEmployeeActiveWorks(employee: IUser): Promise<Array<ICloRequestElement>> {
        return this.getHostWeb().lists
            .getByTitle(this.WORKS_LIST_NAME)
            .items
            .filter(this.ACTIVE_FILTER_STRING)
            .get()
            .then((data: Array<ICloRequestElement>) => data.filter(item => {
                employee.role.permittedSteps.map(step => step.name).includes(item.step as string)
            }))
    }

    fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>> {
        return this.getHostWeb()
            .lists.getByTitle(this.PROJECT_LIST_NAME)
            .items.filter(this.ACTIVE_FILTER_STRING)
            .get()
            .then((data: Array<ICloRequestElement>) => data.filter(item => {
                return (item.submitter as string) === client.name
            }))
    }

    fetchProjectNotes(projectId: number): Promise<Array<INote>> {
        return this.getHostWeb()
            .lists.getByTitle(this.NOTES_LIST_NAME)
            .items.filter(`projectId eq ${projectId}`)
            .get()
    }

    fetchWorkNotes(workId: number): Promise<Array<INote>> {
        return this.getHostWeb()
            .lists.getByTitle(this.NOTES_LIST_NAME)
            .items.filter(`workId eq ${workId}`)
            .get()
    }


    // helper methods and data
    private readonly PROCESS_LIST_NAME: string = "processes"
    private readonly PROJECT_LIST_NAME: string = "projects"
    private readonly WORKS_LIST_NAME: string = "works"
    private readonly NOTES_LIST_NAME: string = "notes"
    private readonly ACTIVE_FILTER_STRING: string = "Step neq 'complete'"
    private readonly HOST_WEB_URL = DB_CONFIG["hostUrl"]

    private getAppWeb(): Web {
        return pnp.sp.configure({
            headers: { "Accept": "application/json; odata=verbose" },
            credentials: "same-origin"
        }, "../").web
    }

    private getHostWeb(): Web {
        return pnp.sp.configure({
                headers: { "Accept": "application/json; odata=verbose" },
                credentials: "same-origin"
            }, "../")
            .crossDomainWeb("../", this.HOST_WEB_URL)
    }

}
