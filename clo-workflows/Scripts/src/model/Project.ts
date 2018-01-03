export type UseType = "Synch" | "Arranging" | "Masters" | "Grand" | "Theatrical" | "Movies" | "Images"

export interface IProject {
    id: string
    type: UseType
    title: string
}
