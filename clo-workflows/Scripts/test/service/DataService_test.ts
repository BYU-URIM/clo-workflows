import * as ava from "ava"
import { DataService } from "../../src/service/DataService"
import { IUser, IUserDto } from "../../src/model/User"
import * as roles from "../../res/json/Roles.json"
import * as steps from "../../res/json/Steps.json"
import * as processFormControls from "../../res/json/ProcessFormControls.json"
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
    const jsonRole: {name: string, permittedSteps: string[]} = roles[userDto.roleName]
    t.deepEqual(role.permittedSteps.map(step => step.name), jsonRole.permittedSteps)

    // check each step in the role object and the jsonRole definition to make sure that each step object is built out correctly
    role.permittedSteps.forEach(step => {
        const jsonStep: {name: string, processFormControls: string[]} = steps[step.name]
        const jsonFormControls: Array<IFormControl> = jsonStep.processFormControls.map((formControlName: string) => processFormControls[formControlName])
        t.deepEqual(step.processFormControls, jsonFormControls)
    })
})
