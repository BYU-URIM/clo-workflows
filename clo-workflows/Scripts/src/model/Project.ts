export type UseType = "Synch" | "Arranging" | "Masters" | "Grand" | "Theatrical" | "Movies" | "Images"

export interface IProject {
    ID: string
    Type: UseType
    Title: string
}
