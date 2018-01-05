import { IUserDto } from "../model/User"
import { IRequestElement } from "../model/RequestElement"

export const MockUsersDtos: Array<IUserDto> = [
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        roleName: "Administrator",
    },
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        roleName: "Senior License Processor",
    },
]

export const MockProjects: Array<IRequestElement> = [
    {
        type: "Theatrical",
        id: 9823,
        title: "Test Theatrical Project",
        descriptionOfWork: "description...",
        artist: "artist name",
        copyrightOwner: "owner name",
    },
]
