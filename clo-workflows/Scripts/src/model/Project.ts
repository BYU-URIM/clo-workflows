export type UseType = "Synch" | "Arranging" | "Masters" | "Grand" | "Theatrical" | "Movies" | "Images"

export interface IProject {
    id: string
    type: UseType
    title: string
}

export interface ISynchProject extends IProject {
    danceTitle: string
    descriptionOfWork: string
    group: string
    timing: string
    artist: string
    copyrightOwner: string
    society: string
    fee: number
    term: string
    mfn: string
    territory: string
    numberOfCopies: number
    optionsContractNotes: string
    notes: string
    contact: string
    dateRequestSend: string
    dateQuoteReceived: string
    dateConfirmedUse: string
    dateOfFollowUp1: string
    dateOfFollowUp2: string
    dateOfFollowUp3: string
    dateOfFollowUp4: string
    datePaymentInformationSent: string
    dateOfContractReceived: string
    dateSentToClient: string
    materialsRequested: string
    creditsRead: string
}

export interface IArrangingProject extends IProject {
    timing: string
    artist: string
    arranger: string
    copyrightOwner: string
    licensingOrganization: string
    instrumentation: string
    society: string
    fee: number
    term: string
    mfn: string
    territory: string
    numberOfCopies: number
    optionsContractNotes: string
    notes: string
    contact: string
    dateRequestSend: string
    dateQuoteReceived: string
    dateConfirmedUse: string
    dateOfFollowUp1: string
    dateOfFollowUp2: string
    dateOfFollowUp3: string
    datePaymentInformationSent: string
    dateOfContractReceived: string
    dateSentToClient: string
    materialsRequested: string
    creditsRead: string
    copyOfScore: boolean
}

export interface IMastersProject extends IProject {
    artist: string
    copyrightOwner: string
    fee: number
    term: string
    mfn: string
    optionsContractNotes: string
    notes: string
    contact: string
    dateRequestSend: string
    dateQuoteReceived: string
    dateConfirmedUse: string
    dateOfFollowUp1: string
    dateOfFollowUp2: string
    dateOfFollowUp3: string
    dateOfContractReceived: string
    dateSentToClient: string
    materialsRequested: string
    creditsRead: string
    album: string
    trackNumber: number
    releaseDate: string
    source: string
}

export interface IGrandProject extends IProject {
    danceTitle: string
    descriptionOfWork: string
    group: string
    timing: string
    artist: string
    copyrightOwner: string
    society: string
    fee: number
    term: string
    mfn: string
    territory: string
    numberOfCopies: number
    optionsContractNotes: string
    notes: string
    contact: string
    dateRequestSend: string
    dateQuoteReceived: string
    dateConfirmedUse: string
    dateOfFollowUp1: string
    dateOfFollowUp2: string
    dateOfFollowUp3: string
    dateOfFollowUp4: string
    dateOfPaymentInformation: string
    dateOfContractReceived: string
    dateSentToClient: string
    materialsRequested: string
    creditsRead: string
}

export interface ITheatricalProject extends IProject {
    descriptionOfWork: string
    artist: string
    copyrightOwner: string
    fee: number
    numberOfCopies: number
    notes: string
    contact: string
    dateRequestSend: string
    dateQuoteReceived: string
    dateContractReceived: string
    dateOfShowing: string
    requestorContactInfo: string
    dateRequestSentToClo: string
    censoring: string
    additionalEdits: string
    cloDetermination: string
}

export interface IMoviesProject extends IProject {
    copyrightOwner: string
    licensingOrganization: string
    fee: number
    territory: string
    optionsContractNotes: string
    notes: string
    contact: string
    dateRequestSend: string
    dateQuoteReceived: string
    dateConfirmedUse: string
    datePaymentInformationSent: string
    releaseDate: string
    projectedAudienceSize: number
    actualAudienceSize: number
    dateOfShowing: string
    requestorContactInfo: string
    dateRequestSentToClo: string
    admissionFee: number
    feeStructure: string
    numberOfShowings: number
    approvedByBYUSA: boolean
    digitalFormat: string
    ftNumber: number
    accountCode: string
}

export interface IImagesProject extends IProject {
    descriptionOfWork: string
    group: string
    copyrightOwner: string
    fee: number
    term: string
    optionsContractNotes: string
    notes: string
    contact: string
    dateRequestSend: string
    source: string
    link: string
}
