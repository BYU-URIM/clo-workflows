import { IDataAccess } from "../dataAccess/IDataAccess"
import { IUserDto, IUser } from "../model/User"
import { IRole } from "../model/Role"
import * as roles from "../../res/json/Roles.json"
import * as steps from "../../res/json/Steps.json"
import * as processFormControls from "../../res/json/ProcessFormControls.json"

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
        role.permittedSteps = roles[userDto.roleName].permittedSteps.map(stepName => steps[stepName])
        role.permittedSteps.forEach(step => {
            // normalized steps contain strings for formControls, map to actual formControl objects
            step.processFormControls = step.processFormControls.map(formControlName => processFormControls[formControlName])
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
}
