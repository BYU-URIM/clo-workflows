import * as ROLES from "../../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../../res/json/processing_config/PROCESS_STEPS.json"
import * as VIEWS from "../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../res/json/form_templates/FORM_CONTROLS.json"
import { IDataAccess } from "../dataAccess/IDataAccess"
import { IUser, IUserDto } from "../model/User"
import { ICloRequestElement } from "../model/CloRequestElement"
import { deepCopy } from "../utils"
import { IFormControl } from "./../model/FormControl"
import { IView } from "../model/View"
import { INote } from "../model/Note"

export class DataService {
    constructor(private dao: IDataAccess) {}

    async fetchUser(): Promise<IUser> {
        const userDto: IUserDto = await this.dao.fetchUser()

        // build out role from res JSON files
        const role = {
            name: userDto.roleName,
            permittedSteps: [],
        }

        // normalized roles contain strings for steps, map to actual step objects
        role.permittedSteps = ROLES[userDto.roleName].permittedSteps.map(stepName => deepCopy(STEPS[stepName]))

        // build user object from userDto and role
        const user: IUser = {
            name: userDto.name,
            username: userDto.username,
            email: userDto.username,
            role,
        }

        return user
    }

    async fetchEmployeeActiveProjects(employee: IUser): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchEmployeeActiveProjects(employee)
    }

    async fetchEmployeeActiveProcesses(employee: IUser): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchEmployeeActiveProcesses(employee)
    }

    async fetchEmployeeActiveWorks(employee: IUser): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchEmployeeActiveWorks(employee)
    }

    async fetchClientActiveProjects(client: IUser): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchClientActiveProjects(client)
    }

    async fetchWorkNotes(workId: number): Promise<Array<INote>> {
        return await this.dao.fetchWorkNotes(workId)
    }

    async fetchProjectNotes(projectId: number): Promise<Array<INote>> {
        return await this.dao.fetchProjectNotes(projectId)
    }

    getView(viewName: string): IView {
        const normalizedView = VIEWS[viewName]
        return {
            formControls: normalizedView.formControls.map(formControlName => deepCopy(FORM_CONTROLS[formControlName])),
            dataSource: normalizedView.dataSource,
        }
    }
}
