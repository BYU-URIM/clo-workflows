import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { SessionStore } from "../../src/store/SessionStore"
import { IDataService } from "../../src/service/dataService/IDataService"
import { RootStore } from "../../src/store/RootStore"
import { MockDataService } from "../../src/service/dataService/MockDataService"
import { IUser } from "../../src/model/User"
import { getRole } from "../../src/model/loader/resourceLoaders"

ava.test("sessionStore recognizes employee", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("Administrator")],
        primaryRole: getRole("Administrator")
    }
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.true(sessionStore.isEmployee)
})

ava.test("sessionStore recognizes anonymous user", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("Anonymous")],
        primaryRole: getRole("Anonymous")
    }
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.false(sessionStore.isEmployee)
})
