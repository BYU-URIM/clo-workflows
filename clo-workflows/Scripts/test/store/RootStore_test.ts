import * as ava from "ava"
import { RootStore } from "../../src/store/RootStore"
import { DataService } from "../../src/service/DataService"
import { DataAccessFactory } from "../../src/dataAccess/DataAccessFactory"
import { useStrict } from "mobx"
import { when, mock, verify, instance } from "ts-mockito"
import { IUser } from "../../src/model/User"

ava.test("root store creates all child stores when an employee logs in", async t => {
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

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    t.truthy(rootStore.uiStore)
    t.truthy(rootStore.userStore)
    t.truthy(rootStore.userProcessStore)
    t.truthy(rootStore.employeeProcessStore)
})

ava.test("root store creates all stores except employeeProcess store when anonymous user logs in", async t => {
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

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    t.truthy(rootStore.uiStore)
    t.truthy(rootStore.userStore)
    t.truthy(rootStore.userProcessStore)
    t.falsy(rootStore.employeeProcessStore)
})
