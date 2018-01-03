import { instance } from 'ts-mockito'
import { roleData } from "./MockData"
import { IRole } from "./../model/Role"
import { IDataAccess } from "./IDataAccess"
import { IUser } from "../model/User"
import {IProject} from "../model/Project";

export class MockDataAccess implements IDataAccess {

    fetchUser(): Promise<IUser> {
        return Promise.resolve({
                name: "Connor Moody",
                username: "cmoody4",
                email: "cmoody4@byu.edu",
                role: roleData[0],
            })
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
