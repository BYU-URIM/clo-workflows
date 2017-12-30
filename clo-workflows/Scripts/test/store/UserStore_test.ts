import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { UserStore } from "../../src/store/UserStore"
import { AsyncService } from "../../src/service/AsyncService"
import { RoleName } from "../../src/model/Role"
import { RootStore } from "../../src/store/RootStore"

ava.test("userStore recognizes employee", async t => {
    const mockAsyncService = mock(AsyncService)
    when(mockAsyncService.fetchUser()).thenReturn(Promise.resolve({
        name: "Connor Moody",
        username: "cmoody4",
        email: "cdmoody0604@gmail.com",
        role: {
            name: "Administrator" as RoleName,
            permittedSteps: [],
        },
    }))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const asyncService = instance(mockAsyncService)

    const userStore: UserStore = new UserStore(rootStore, asyncService)
    await userStore.init()
    t.true(userStore.isEmployee)
})

ava.test("userStore recognizes anonymous user", async t => {
    const mockAsyncService = mock(AsyncService)
    when(mockAsyncService.fetchUser()).thenReturn(Promise.resolve({
        name: "Connor Moody",
        username: "cmoody4",
        email: "cdmoody0604@gmail.com",
        role: {
            name: "Anonymous" as RoleName,
            permittedSteps: [],
        },
    }))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const asyncService = instance(mockAsyncService)

    const userStore: UserStore = new UserStore(rootStore, asyncService)
    await userStore.init()
    t.false(userStore.isEmployee)
})
