import { MockUsersDtos } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUserDto } from "../model/User"
import {IProject} from "../model/Project";

export class MockDataAccess implements IDataAccess {

    fetchUser(): Promise<IUserDto> {
        return Promise.resolve(MockUsersDtos[0])
    }
    fetchUserProjects(): Array<IProject> {
            return [
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
}
