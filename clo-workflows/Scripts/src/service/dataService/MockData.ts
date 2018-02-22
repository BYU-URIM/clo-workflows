import { ICloRequestElement } from "../../model/CloRequestElement"
import { IUser, IUserDto } from "../../model/User"
import { INote } from "../../model/Note"

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

export const MockProcesses: Array<ICloRequestElement> = [
    {
        Id: 1,
        step: "Public Domain Research",
        projectId: 1,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 2,
        step: "Public Domain Research",
        projectId: 1,
        workId: 2,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 3,
        step: "Ownership Research",
        projectId: 1,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 4,
        step: "Payment",
        projectId: 1,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 5,
        step: "Public Domain Research",
        projectId: 1,
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 6,
        step: "Public Domain Research",
        projectId: 1,
        workId: 2,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 7,
        step: "Ownership Research",
        projectId: 2,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 8,
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
        workId: 1,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
]

export const MockProjects: Array<ICloRequestElement> = [
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
        Id: 1,
        type: "Music",
        title: "Song Name",
        artist: "Artist Name",
    },
    {
        Id: 2,
        type: "Book",
        title: "Book Name",
        author: "Author Name",
    },
    {
        Id: 3,
        type: "Article",
        title: "Article Name",
        author: "Author Name",
    },
]

export const MockNotes: Array<INote> = [
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        projectId: 1,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        projectId: 1,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        projectId: 2,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        projectId: 2,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 1,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        workId: 1,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: 1,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 2,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        workId: 2,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: 2,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 3,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: 3,
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: 1,
    },
]
