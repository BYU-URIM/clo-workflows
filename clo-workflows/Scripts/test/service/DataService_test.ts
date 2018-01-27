import * as ava from "ava"
import { DataService } from "../../src/service/DataService"
import { IUser, IUserDto } from "../../src/model/User"
import * as USER_ROLES from "../../res/json/processing_config/USER_ROLES.json"
import * as PROCESS_STEPS from "../../res/json/processing_config/PROCESS_STEPS.json"
import * as PROCESS_FORM_CONTROLS from "../../res/json/PROCESS_FORM_CONTROLS.json"
import { IRole } from "../../src/model/Role"
import { MockDataAccess } from "../../src/dataAccess/MockDataAccess"
import { IFormControl } from "../../src/model/FormControl"

/*
    ensure that fetchUser creates a userObject with the correct shape
*/
ava.test("test that fetchUser correctly builds a user object", async t => {

    const dataAccess = new MockDataAccess()
    const userDto: IUserDto = await dataAccess.fetchUser()

    const dataService = new DataService(dataAccess)
    const user: IUser = await dataService.fetchUser()

    // ensure that the dataService correctly builds out the user object from the userDto returned by the dataAccess layer
    // first check that that the correct role was built
    t.true(user.role.name === userDto.roleName)

    // check the permitted step arrays in constructed role and json definition role
    const role: IRole = user.role
    const jsonRole: {name: string, permittedSteps: string[]} = USER_ROLES[userDto.roleName]
    t.deepEqual(role.permittedSteps.map(step => step.name), jsonRole.permittedSteps)
    role.permittedSteps.forEach(step => {
        t.truthy(step.name)
        t.regex(String(step.stepId), /[0-9]+/)
        t.not(step.view, undefined)
    })
})
