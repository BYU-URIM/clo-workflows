import * as ava from "ava"
import { getRole } from "../../src/model/loader/resourceLoaders"
import { User } from "../../src/model/User"
import * as mobx from "mobx"

// primary role should be the highest ranking role a user has
ava.test("test that the primary role function on the User object works as expected", t => {
        const slpRole = getRole("Senior License Processor")
        const jlpRole = getRole("Junior License Processor")
        const supRole = getRole("Supervisor")

        const user = new User("name", "username", "email", "id", [slpRole, jlpRole, supRole])
        t.deepEqual(mobx.toJS(user.primaryRole), supRole)
})