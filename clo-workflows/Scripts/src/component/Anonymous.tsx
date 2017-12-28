import * as React from 'react'
import { IUser } from '../model/User'
import InProgressProjects from './Anonymous/InProgressProjects'
import CreateNewProject from './Anonymous/CreateNewProject'
import Header from './Anonymous/Header'
interface IAnonymousProps {
  currentUser: IUser
  currentRole: string
}
const Anonymous = (props: IAnonymousProps) => {
  return (
    <div>
      <Header currentUser={props.currentUser} currentRole={props.currentRole} />
      <CreateNewProject currentUser={props.currentUser} />
      <InProgressProjects currentUser={props.currentUser} />
    </div>
  )
}

export default Anonymous
