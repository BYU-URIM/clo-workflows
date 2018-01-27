import * as ROLES from "../../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../../res/json/processing_config/PROCESS_STEPS.json"
import * as VIEWS from "../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../res/json/form_templates/FORM_CONTROLS.json"
import { IDataAccess } from "../dataAccess/IDataAccess"
import { IUser, IUserDto } from "../model/User"
import { ICloRequestElement } from "../model/CloRequestElement"
import { deepCopy } from "../utils"
import { IFormControl } from "./../model/FormControl"
import { View } from "../model/View"

export class DataService {
    constructor(
        private dao: IDataAccess,
    ) {}

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

    async fetchEmployeeActiveProjects(): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchEmployeeActiveProjects()
    }

    async fetchEmployeeActiveProcesses(): Promise<Array<ICloRequestElement>> {
        return this.dao.fetchEmployeeActiveProcesses()
    }

    async fetchEmployeeActiveWorks(): Promise<Array<ICloRequestElement>> {
        return this.dao.fetchEmployeeActiveWorks()
    }

    async fetchClientProjects(): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchClientProjects()
    }
    
    async fetchClientCompletedProjects(): Promise<Array<ICloRequestElement>> {
        return await this.dao.fetchClientCompletedProjects()
    }

    getView(viewName: string): View {
        return VIEWS[viewName].map(formControlName => deepCopy(FORM_CONTROLS[formControlName]))
    }
}
