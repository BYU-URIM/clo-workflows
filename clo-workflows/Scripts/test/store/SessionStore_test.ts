import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { SessionStore } from "../../src/store/SessionStore"
import { IDataService } from "../../src/service/dataService/IDataService"
import { RootStore } from "../../src/store/RootStore"
import { MockDataService } from "../../src/service/dataService/MockDataService"
import { User } from "../../src/model/User"
import { getRole } from "../../src/model/loader/resourceLoaders"

ava.test("sessionStore recognizes employee", async t => {
    const mockDataService = mock(MockDataService)
    const user = new User(
        "Connor Moody",
        "cmoody4",
        "email@gmail.com",
        "1234-5678",
        [getRole("Administrator")]
    )
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
    const user = new User(
        "Connor Moody",
        "cmoody4",
        "email@gmail.com",
        "1234-5678",
        [getRole("Anonymous")]
    )
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))

    const mockRootStore = mock(RootStore)

    const rootStore = instance(mockRootStore)
    const dataService = instance(mockDataService)

    const sessionStore: SessionStore = new SessionStore(rootStore, dataService)
    await sessionStore.init()
    t.false(sessionStore.isEmployee)
})
