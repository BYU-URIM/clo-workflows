import { SessionStore, RootStore, ClientStore } from "./../../src/store/"
import * as ava from "ava"
import { useStrict } from "mobx"
import { when, mock, verify, instance, spy, anything } from "ts-mockito"
import { IUser } from "../../src/model"
import { MockProjects, MockUsers, MockProcesses, MockWorks, MockDataService, ListName } from "../../src/service/"
import { getRole } from "../../src/model/loader"

ava.test("root store creates session store, employee store when an employee logs in", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("Administrator")],
        primaryRole: getRole("Administrator"),
    }

    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))
    when(mockDataService.fetchEmployeeActiveProcesses(anything())).thenReturn(Promise.resolve(MockProcesses))
    when(mockDataService.fetchRequestElementsById(anything(), ListName.PROJECTS)).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchRequestElementsById(anything(), ListName.WORKS)).thenReturn(Promise.resolve(MockWorks))
    when(mockDataService.fetchClientActiveProjects(anything())).thenReturn(Promise.resolve(MockProjects))

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    t.truthy(rootStore.sessionStore)
    t.truthy(rootStore.employeeStore)
    t.falsy(rootStore.clientStore)
})

ava.test("root store creates sessionStore, client store when client logs in", async t => {
    const mockDataService = mock(MockDataService)
    const user: IUser = {
        name: "Connor Moody",
        username: "cmoody4",
        email: "email@gmail.com",
        Id: "1234-5678",
        roles: [getRole("Anonymous")],
        primaryRole: getRole("Anonymous"),
    }
    when(mockDataService.fetchUser()).thenReturn(Promise.resolve(user))
    when(mockDataService.fetchRequestElementsById(anything(), ListName.PROJECTS)).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchClientActiveProjects(anything())).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchClientProjects()).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchClientProcesses()).thenReturn(Promise.resolve(MockProcesses))

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    t.truthy(rootStore.sessionStore)
    t.truthy(rootStore.clientStore)
    t.falsy(rootStore.employeeStore)
})
