import { IUserDto, IUser } from "../model/User"
import { ICloRequestElement } from "../model/CloRequestElement"
import { INote } from "../model/Note"
import { when } from "ts-mockito"

export const MockUsersDtos: Array<IUserDto> = [
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        roleName: "Senior License Processor",
    },
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
        workId: 3,
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
        projectId: 2,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 8,
        step: "Payment",
        projectId: 2,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 9,
        step: "Payment",
        projectId: 2,
        workId: 2,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        id: 10,
        step: "Payment",
        projectId: 2,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
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
    }
]

export const MockNotes: Array<INote> = [
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        projectId: 1
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        projectId: 1
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        projectId: 2
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        projectId: 2
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 1
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        workId: 1
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: 1
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 2
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        workId: 2
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: 2
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 3
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: 3
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 1
    },
]