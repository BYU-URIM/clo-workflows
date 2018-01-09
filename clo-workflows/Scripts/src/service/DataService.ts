import { IFormControl } from './../model/FormControl'
import { ObservableMap } from 'mobx'
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
        return await this.dao.fetchClientActiveProjects()
    }

    // returns a map of work type name to form controls
    getworkFormControls(): Map<string, Array<IFormControl>> {
        const workFormControlMap: Map<string, Array<IFormControl>> = new Map()
        Object.keys(WORK_TYPES).forEach(workType => {
            const formControls = WORK_TYPES[workType].map(formControlName => Object.assign({}, WORK_FORM_CONTROLS[formControlName])) as Array<IFormControl>
            workFormControlMap.set(workType, formControls)
        })
        return workFormControlMap
    }

    // returns a map of project type name to form controls
    getProjectFormControls(): Map<string, Array<IFormControl>> {
        const projectFormControls: Map<string, Array<IFormControl>> = new Map()
        Object.keys(PROJECT_TYPES).forEach(projectType => {
            const formControls = PROJECT_TYPES[projectType].map(formControlName => Object.assign({}, PROJECT_FORM_CONTROLS[formControlName])) as Array<IFormControl>
            projectFormControls.set(projectType, formControls)
        })
        return projectFormControls
}
    // returns a map of step name to form controls, returns only the steps permitted for the provided user
    getPermittedProcessFormControls(user: IUser): Map<string, Array<IFormControl>> {
        const processFormControls: Map<string, Array<IFormControl>> = new Map()
        user.role.permittedSteps.forEach(step => {
            const formControls = PROCESS_FORM_CONTROLS[step.name]
            processFormControls.set(step.name, formControls)
        })

        return processFormControls
    }
    
    getProjectTypes(){
        return PROJECT_TYPES
    }
}
