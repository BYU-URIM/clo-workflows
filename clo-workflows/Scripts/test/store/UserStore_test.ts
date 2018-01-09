import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { SessionStore } from "../../src/store/SessionStore"
import { DataService } from "../../src/service/DataService"
import { RootStore } from "../../src/store/RootStore"

ava.test("sessionStore recognizes employee", async t => {
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

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.true(sessionStore.isEmployee)
})

ava.test("sessionStore recognizes anonymous user", async t => {
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

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.false(sessionStore.isEmployee)
})
