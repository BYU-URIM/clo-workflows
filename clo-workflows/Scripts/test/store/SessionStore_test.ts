import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { SessionStore, RootStore } from "../../src/store/"
import { MockDataService } from "../../src/service/dataService/MockDataService"
import { IUser } from "../../src/model"
import { getRole } from "../../src/model/loader/resourceLoaders"

ava.test("sessionStore recognizes employee", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("LTT Administrator")],
        primaryRole: getRole("LTT Administrator"),
    }
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.true(sessionStore.isEmployee)
})

ava.test("sessionStore recognizes LTT Client user", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("LTT Client")],
        primaryRole: getRole("LTT Client"),
    }
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.false(sessionStore.isEmployee)
})
