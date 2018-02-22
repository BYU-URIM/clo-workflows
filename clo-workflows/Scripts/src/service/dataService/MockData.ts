import { IUserDto, IUser } from "../../model/User"
import { ICloRequestElement } from "../../model/CloRequestElement"

export const MockUsersDtos: Array<IUserDto> = [
    // {
    //     name: "Connor Moody",
    //     email: "email@gmail.com",
    //     username: "cmoody",
    //     roleName: "Junior License Processor",
    // },
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        roleName: "Anonymous",
    },
]

export const MockUsers: Array<IUser> = [
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        role: null,
    },
]

export const MockProjects: Array<ICloRequestElement> = [
    {
        type: "Theatrical",
        id: 1,
        title: "Test Theatrical Project",
        descriptionOfWork: "description...",
        artist: "artist name",
        copyrightOwner: "owner name",
        department: "Test department",
    },
    {
        type: "Theatrical",
        id: 2,
        title: "Another Theatrical Project",
        descriptionOfWork: "More description stuff",
        artist: "Miley Cyrus",
        copyrightOwner: "Disney",
        department: "Club Disney Department",
    },
    {
        type: "Theatrical",
        id: 3,
        title: "A theatrical project again",
        descriptionOfWork: "More description stuff",
        artist: "Miley Cyrus",
        copyrightOwner: "Disney",
        department: "Club Disney Department",
    },
    {
        type: "Theatrical",
        id: 4,
        title: "Another Project",
        descriptionOfWork: "More description stuff",
        artist: "Miley Cyrus",
        copyrightOwner: "Disney",
        department: "Club Disney Department",
    },
]

export const MockProcesses: Array<ICloRequestElement> = [
    {
        id: 1,
        step: "Public Domain Research",
        projectId: 1,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 2,
        step: "Public Domain Research",
        projectId: 1,
        workId: 2,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 3,
        step: "Ownership Research",
        projectId: 1,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 4,
        step: "Payment",
        projectId: 1,
        workId: 4,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 5,
        step: "Public Domain Research",
        projectId: 1,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 6,
        step: "Public Domain Research",
        projectId: 1,
        workId: 2,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 7,
        step: "Ownership Research",
        projectId: 1,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 8,
        step: "Payment",
        projectId: 1,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 9,
        step: "Payment",
        projectId: 1,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 10,
        step: "Payment",
        projectId: 2,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 11,
        step: "Payment",
        projectId: 2,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 12,
        step: "Payment",
        projectId: 2,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 13,
        step: "Payment",
        projectId: 2,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 14,
        step: "Payment",
        projectId: 2,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 15,
        step: "Payment",
        projectId: 3,
        workId: 1,
        dateSubmittedToCurrentStep: "1/17/2018",
    },
    {
        id: 16,
        step: "Payment",
        projectId: 3,
        workId: 1,
        dateSubmittedToCurrentStep: "11/1/2018",
    },
    {
        id: 17,
        step: "Payment",
        projectId: 3,
        workId: 1,
        dateSubmittedToCurrentStep: "1/14/2018",
    },
    {
        id: 18,
        step: "Payment",
        projectId: 3,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 19,
        step: "Payment",
        projectId: 3,
        workId: 1,
        dateSubmittedToCurrentStep: "1/3/2018",
    },
    {
        id: 20,
        step: "Payment",
        projectId: 3,
        workId: 1,
        dateSubmittedToCurrentStep: "1/5/2018",
    },
]

export const MockWorks: Array<ICloRequestElement> = [
    {
        id: 1,
        type: "Music",
        title: "Song Name",
        artist: "Artist Name",
    },
    {
        id: 2,
        type: "Book",
        title: "Book Name",
        author: "Author Name",
    },
    {
        id: 3,
        type: "Article",
        title: "Article Name",
        author: "Author Name",
    },
    {
        id: 4,
        type: "Book Chapter",
        title: "Chapter Name",
        author: "Author Name",
    },
]
