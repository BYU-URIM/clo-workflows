import * as ava from "ava"
import { getRole } from "../../src/model/loader"
import { User } from "../../src/model"
import * as mobx from "mobx"

// primary role should be the highest ranking role a user has
ava.test("test that the primary role function on the User object works as expected", t => {
    const slpRole = getRole("LTT Senior License Processor")
    const jlpRole = getRole("LTT Junior License Processor")
    const supRole = getRole("LTT Supervisor")

    const user = new User("name", "username", "email", "id", [slpRole, jlpRole, supRole])
    t.deepEqual(mobx.toJS(user.primaryRole), mobx.toJS(supRole))
})
