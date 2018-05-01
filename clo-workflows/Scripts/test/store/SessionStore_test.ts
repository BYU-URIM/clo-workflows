import * as ava from "ava"
import { mock, when, instance } from "ts-mockito"
import { SessionStore, RootStore } from "../../src/store/"
import { IDataService, MockDataService,  } from "../../src/service"
import { IUser } from "../../src/model"
import { getRole } from "../../src/model/loader"

ava.test("sessionStore recognizes employee", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("LTT Administrator")],
        loginName: "i:0#.w|byu\cmoody4",
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
        loginName: "i:0#.w|byu\cmoody4",
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
