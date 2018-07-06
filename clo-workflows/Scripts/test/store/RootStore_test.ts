import { RootStore } from "./../../src/store/"
import { when, mock, instance, anything } from "ts-mockito"
import { IUser } from "../../src/model"
import { getRole } from "../../src/model/loader/resourceLoaders"

import { ListName, MockProjects, MockProcesses, MockWorks, MockNotes } from "../../src/service/"
import { MockDataService } from "../../src/service/dataService/MockDataService"

test("root store creates session store, employee store, and client store when an employee logs in", async () => {
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
    when(mockDataService.fetchRequestElementsById(anything(), ListName.PROJECTS)).thenReturn(Promise.resolve(MockProjects))
    when(mockDataService.fetchRequestElementsById(anything(), ListName.WORKS)).thenReturn(Promise.resolve(MockWorks))
    when(mockDataService.fetchClientActiveProjects(anything())).thenReturn(Promise.resolve(MockProjects))

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    expect(rootStore.sessionStore).toBeTruthy()
    expect(rootStore.employeeStore).toBeTruthy()
    expect(rootStore.clientStore).toBeTruthy()
})

test("root store creates sessionStore, client store when client logs in", async () => {
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
    // when(mockDataService.fetchRequestElementsById(anything(), ListName.PROJECTS)).thenReturn(Promise.resolve(MockProjects))
    // when(mockDataService.fetchClientActiveProjects(anything())).thenReturn(Promise.resolve(MockProjects))
    // when(mockDataService.fetchClientProjects()).thenReturn(Promise.resolve(MockProjects))
    // when(mockDataService.fetchClientProcesses()).thenReturn(Promise.resolve(MockProcesses))
    // when(mockDataService.fetchClientNotes(anything())).thenReturn(Promise.resolve(MockNotes))

    const rootStore: RootStore = new RootStore(instance(mockDataService))
    await rootStore.init()
    expect(rootStore.sessionStore).toBeTruthy()
    expect(rootStore.clientStore).toBeTruthy()
    expect(rootStore.employeeStore).toBeFalsy()
})
