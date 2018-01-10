import { IFormControl } from "./../model/FormControl"
import { ObservableMap } from "mobx"
import { IDataAccess } from "../dataAccess/IDataAccess"
import { IUserDto, IUser } from "../model/User"
import { IRole } from "../model/Role"
import * as USER_ROLES from "../../res/json/USER_ROLES.json"
import * as PROCESS_STEPS from "../../res/json/PROCESS_STEPS.json"
import * as PROCESS_FORM_CONTROLS from "../../res/json/PROCESS_FORM_CONTROLS.json"
import * as WORK_TYPES from "../../res/json/WORK_TYPES.json"
import * as WORK_FORM_CONTROLS from "../../res/json/WORK_FORM_CONTROLS.json"
import * as PROJECT_TYPES from "../../res/json/PROJECT_TYPES.json"
import * as PROJECT_FORM_CONTROLS from "../../res/json/PROJECT_FORM_CONTROLS.json"
import { IRequestElement } from "../model/RequestElement"
import { deepCopy } from "../utils"

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
        role.permittedSteps = USER_ROLES[userDto.roleName].permittedSteps.map(stepName => Object.assign({}, PROCESS_STEPS[stepName]))

        // build user object from userDto and role
        const user: IUser = {
            name: userDto.name,
            username: userDto.username,
            email: userDto.username,
            role,
        }

        return user
    }

    async fetchEmployeeActiveProjects(): Promise<Array<IRequestElement>> {
        return await this.dao.fetchEmployeeActiveProjects()
    }

    async fetchClientActiveProjects(): Promise<Array<IRequestElement>> {
        const x = await this.dao.fetchClientActiveProjects()
        console.log("!!!~~~~!!!")
        return x
    }

    // returns a map of work type name to form controls
    getWorkFormControlsForType(workType: string): Array<IFormControl> {
        return deepCopy(WORK_TYPES[workType].map(formControlName => WORK_FORM_CONTROLS[formControlName]))
    }

    // returns a map of project type name to form controls
    getProjectFormControlsForType(projectType: string): Array<IFormControl> {
        return deepCopy(PROJECT_TYPES[projectType].map(formControlName => PROJECT_FORM_CONTROLS[formControlName]))
    }

    // returns a map of step name to form controls, returns only the steps permitted for the provided user
    getPermittedProcessFormControlsForStep(stepName: string): Array<IFormControl> {
        return deepCopy(PROCESS_STEPS[stepName].permittedFormControls.map(formControlName => PROCESS_FORM_CONTROLS[formControlName]))
    }

    getProjectTypes(): Array<string> {
        return Object.keys(PROJECT_TYPES)
    }
}
