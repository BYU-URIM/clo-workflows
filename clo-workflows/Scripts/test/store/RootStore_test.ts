import { RootStore } from "./../../src/store/"
import * as ava from "ava"
import { when, mock, instance, anything } from "ts-mockito"
import { IUser } from "../../src/model"
import { getRole } from "../../src/model/loader/resourceLoaders"

import { MockProjects, MockNotes, MockProcesses, MockWorks, MockDataService, ListName } from "../../src/service/"

ava.test("root store creates session store, employee store, and client store when an employee logs in", async t => {
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
    when(mockDataService.fetchEmployeeActiveProcesses(anything())).thenReturn(Promise.resolve(MockProcesses))
    when(mockDataService.fetchRequestElementsById(anything(), ListName.PROJECTS)).thenReturn(
        Promise.resolve(MockProjects)
    )
    when(mockDataService.fetchRequestElementsById(anything(), ListName.WORKS)).thenReturn(Promise.resolve(MockWorks))
    when(mockDataService.fetchClientActiveProjects(anything())).thenReturn(Promise.resolve(MockProjects))

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    t.truthy(rootStore.sessionStore)
    t.truthy(rootStore.employeeStore)
    t.truthy(rootStore.clientStore)
})

ava.test("root store creates sessionStore, client store when client logs in", async t => {
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
    when(mockDataService.fetchRequestElementsById(anything(), ListName.PROJECTS)).thenReturn(
        Promise.resolve(MockProjects)
    )
    when(mockDataService.fetchClientActiveProjects(anything())).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchClientProjects()).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchClientProcesses()).thenReturn(Promise.resolve(MockProcesses))
    when(mockDataService.fetchClientNotes(anything())).thenReturn(Promise.resolve(MockNotes))

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    t.truthy(rootStore.sessionStore)
    t.truthy(rootStore.clientStore)
    t.falsy(rootStore.employeeStore)
})
