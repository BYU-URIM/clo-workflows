import { mock, when, instance } from "ts-mockito"
import { SessionStore, RootStore } from "../../src/store/"
import { MockDataService } from "../../src/service/dataService/MockDataService"
import { IUser } from "../../src/model"
import { getRole } from "../../src/model/loader/resourceLoaders"

test("sessionStore recognizes employee", async () => {
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
    expect(sessionStore.isEmployee).toBe(true)
})

test("sessionStore recognizes LTT Client user", async () => {
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
    expect(sessionStore.isEmployee).toBe(false)
})
