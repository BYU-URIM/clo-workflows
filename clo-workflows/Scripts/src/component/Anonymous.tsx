import * as React from "react"
import { IUser } from "../model/User"
import {NewProject} from "./NewProject"
import {IProject} from "../model/Project";
import {ExistingProjects} from "./ExistingProjects";

interface IAnonymousProps {
  currentUser: IUser
  currentUserProjects: Array<IProject>
}
export class Anonymous extends React.Component<IAnonymousProps> {
  render() {
    const { currentUser, currentUserProjects } = this.props
    return (
      <div>
        <NewProject currentUser={currentUser} />
        <ExistingProjects currentUser={currentUser} currentUserProjects = {currentUserProjects} />

      </div>
    )
  }
}
