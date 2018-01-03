import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { UserStore } from "../../src/store/UserStore"
import { DataService } from "../../src/service/DataService"
import { RootStore } from "../../src/store/RootStore"

ava.test("userStore recognizes employee", async t => {
    const mockDataService = mock(DataService)
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve({
        name: "Connor Moody",
        username: "cmoody4",
        email: "cdmoody0604@gmail.com",
        role: {
            name: "Administrator",
            permittedSteps: [],
        },
    }))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const userStore: UserStore = new UserStore(rootStore, dataService)
    await userStore.init()
    t.true(userStore.isEmployee)
})

ava.test("userStore recognizes anonymous user", async t => {
    const mockDataService = mock(DataService)
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve({
        name: "Connor Moody",
        username: "cmoody4",
        email: "cdmoody0604@gmail.com",
        role: {
            name: "Anonymous",
            permittedSteps: [],
        },
    }))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const userStore: UserStore = new UserStore(rootStore, dataService)
    await userStore.init()
    t.false(userStore.isEmployee)
})
