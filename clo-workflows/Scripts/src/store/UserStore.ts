import { MockDataAccess } from './../dataAccess/MockDataAccess'
import { IProject } from './../model/Project'
import { RootStore } from "./RootStore"
import { AsyncService } from "../service/AsyncService"
import { IUser } from "../model/User"
import { observable, action, computed } from "mobx"

export class UserStore {
    constructor(
        private root: RootStore,
        private asyncService: AsyncService,
    ) {}

    @observable currentUser: IUser
    @observable currentUserProjects?: Array<IProject>


    @action async init(): Promise<void> {
        this.currentUser = await this.asyncService.fetchUser()
        this.currentUserProjects = [
            {
                ID:"project1",
                Title:"Project 1 Title",
                Type:"Synch"
            },
            {
                ID:"project2",
                Title:"Project 2 Title",
                Type:"Arranging"
            },{
                ID:"project3",
                Title:"Project 2 Title",
                Type:"Masters"
            }
        ]
    }

    @computed get isEmployee(): boolean {
        return this.currentUser
            && this.currentUser.role
            && this.currentUser.role.name !== "Anonymous"
    }
}
