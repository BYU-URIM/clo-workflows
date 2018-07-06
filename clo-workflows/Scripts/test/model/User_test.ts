import "jest"
import { getRole } from "../../src/model/loader/resourceLoaders"
import { User } from "../../src/model"
import * as mobx from "mobx"

// primary role should be the highest ranking role a user has
test("test that the primary role function on the User object works as expected", () => {
    const slpRole = getRole("LTT Senior License Processor")
    const jlpRole = getRole("LTT Junior License Processor")
    const supRole = getRole("LTT Supervisor")

    const user = new User("name", "username", "email", "id", [slpRole, jlpRole, supRole])
    expect(mobx.toJS(user.primaryRole)).toEqual(mobx.toJS(supRole))
})
