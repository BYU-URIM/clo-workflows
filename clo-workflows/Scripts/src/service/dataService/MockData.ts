import { IUserDto, User, CloRequestElement, INote, NoteScope } from "../../model"

export const MockUsersDtos: Array<IUserDto> = [
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        Id: "1234-5678",
        roleNames: ["Junior License Processor"],
    },
    {
        name: "Connor Moody",
        email: "email@gmail.com",
        username: "cmoody",
        Id: "1234-5678",
        roleNames: ["LTT Client"],
    },
]

export const MockUsers: Array<User> = [
    new User(
        "Connor Moody",
        "cmoody",
        "email@gmail.com",
        "1234-5678",
        []
    )
]

export const MockProjects: Array<CloRequestElement> = [
    {
        type: "Theatrical",
        Id: 1,
        Title: "Test Theatrical Project",
        descriptionOfWork: "description...",
        artist: "artist name",
        copyrightOwner: "owner name",
        department: "Test department",
        submitterId: "cmoody4"
    },
    {
        type: "Theatrical",
        Id: 2,
        Title: "Another Theatrical Project",
        descriptionOfWork: "More description stuff",
        artist: "Miley Cyrus",
        copyrightOwner: "Disney",
        department: "Club Disney Department",
        submitterId: "cmoody4"
    },
]

export const MockProcesses: Array<CloRequestElement> = [
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
        Id: 9,
        step: "Payment",
        projectId: 2,
        workId: 2,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
    {
        Id: 10,
        step: "Payment",
        projectId: 2,
        workId: 3,
        dateSubmittedToCurrentStep: "1/1/2018",
    },
]

export const MockWorks: Array<CloRequestElement> = [
    {
        Id: 1,
        type: "Music",
        Title: "Song Name",
        artist: "Artist Name",
    },
    {
        Id: 2,
        type: "Book",
        Title: "Book Name",
        authorName: "Author Name",
    },
    {
        Id: 3,
        type: "Article",
        Title: "Article Name",
        authorName: "Author Name",
    }
]

export const MockNotes: Array<INote> = [
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        projectId: "1",
        scope: NoteScope.CLIENT
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        projectId: "1",
        scope: NoteScope.CLIENT
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        projectId: "2",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        projectId: "2",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: "1",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        workId: "1",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: "1",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: "2",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2010",
        text: "Sed ut perspiciatis unde omnis, quis nostrum exercitationem ullam corporis",
        workId: "2",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: "2",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: "3",
        scope: NoteScope.EMPLOYEE
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2015",
        text: "Sed ut perspiciatis unde omnis iste natus error sit",
        workId: "1",
        scope: NoteScope.CLIENT
    },
    {
        submitter: "employee name",
        dateSubmitted: "1/1/2013",
        text: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis",
        workId: "1",
        scope: NoteScope.CLIENT
    },
]
