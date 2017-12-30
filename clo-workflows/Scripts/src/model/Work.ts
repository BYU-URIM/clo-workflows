export type WorkType = "Music" | "Book" | "Article" | "Book Chapter" | "Image" | "Video" | "Website" | "Other"

export interface IWork {
    Type: WorkType
    ID: number
}

export interface IMusicWork extends IWork {
    Course: string
    Format: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    SeriesTitle: string
    Edition: string
    FormatInformation: string
    CallNumber: number
    URL: string
    HardCopyOwner: string
}

export interface IBookWork extends IWork {
    Course: string
    Format: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    Edition: string
    FormatInformation: string
    CallNumber: number
    ISBN: number
    TotalPages: number
    TotalChapters: number
    URL: string
    HardCopyOwner: string
}

export interface IArticleWork extends IWork {
    Course: string
    Format: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    JournalTitle: string
    Edition: string
    FormatInformation: string
    CallNumber: string
    ISSN: number
    Volume: number
    Issue: string
    PageRange: string
    TotalPages: number
    URL: string
    HardCopyOwner: string
}

export interface IBookChapterWork extends IWork {
    Course: string
    Format: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    BookTitle: string
    Edition: string
    FormatInformation: string
    CallNumber: number
    ISBN: number
    PageRange: string
    TotalPages: number
    URL: string
    HardCopyOwner: string
}

export interface IImageWork extends IWork {
    Course: string
    Format: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    AlbumTitle: string
    Edition: string
    FormatInformation: string
    CallNumber: number
    URL: string
    HardCopyOwner: string
}

export interface IVideoWork extends IWork {
    Course: string
    Format: string
    Title: string
    URL: string
    HoldType: string
    HoldFrom: string
    HoldUnitl: string
    Year: string
    Director: string
    HardCopyOwner: string
}

export interface IWebsiteWork extends IWork {
    Course: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    URL: string
    HardCopyOwner: string
}

export interface IOtherWork extends IWork {
    Course: string
    Format: string
    Title: string
    Author: string
    Publisher: string
    YearPublished: string
    SeriesTitle: string
    Edition: string
    FormatInformation: string
    CallNumber: number
    URL: string
    HardCopyOwner: string
}
