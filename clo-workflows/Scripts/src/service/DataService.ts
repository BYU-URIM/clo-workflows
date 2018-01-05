import { IDataAccess } from "../dataAccess/IDataAccess"
import { IUserDto, IUser } from "../model/User"
import { IRole } from "../model/Role"
import * as roles from "../../res/json/Roles.json"
import * as steps from "../../res/json/Steps.json"
import * as processFormControls from "../../res/json/ProcessFormControls.json"
import * as workTypes from "../../res/json/WorkTypes.json"
import * as workFormControls from "../../res/json/WorkFormControls.json"
import * as projectTypes from "../../res/json/ProjectTypes.json"
import * as projectFormControls from "../../res/json/ProjectFormControls.json"
import { IFormControl } from "../model/FormControl"
import { IRequestElement } from "../model/RequestElement"

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
        role.permittedSteps = roles[userDto.roleName].permittedSteps.map(stepName => Object.assign({}, steps[stepName]))
        role.permittedSteps.forEach(step => {
            // normalized steps contain strings for formControls, map to actual formControl objects
            step.processFormControls = step.processFormControls.map(formControlName => Object.assign({}, processFormControls[formControlName]))
        })

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

    getWorkFormControls(): Map<string, Array<IFormControl>> {
        const workFormControlMap: Map<string, Array<IFormControl>> = new Map()
        Object.keys(workTypes).forEach(workType => {
            const formControls = workTypes[workType].map(formControlName => workFormControls[formControlName]) as Array<IFormControl>
            workFormControlMap.set(workType, formControls)
        })
        return workFormControlMap
    }

    getProjectFormControls(): Map<string, Array<IFormControl>> {
        const projectFormControlMap: Map<string, Array<IFormControl>> = new Map()
        Object.keys(projectTypes).forEach(projectType => {
            const formControls = projectTypes[projectType].map(formControlName => projectFormControls[formControlName]) as Array<IFormControl>
            projectFormControlMap.set(projectType, formControls)
        })
        return projectFormControlMap
    }
}
