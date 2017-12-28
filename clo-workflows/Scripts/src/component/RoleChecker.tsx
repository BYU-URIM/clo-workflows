import * as React from 'react'
import { observer } from 'mobx-react'
import Anonymous from './Anonymous'
import { IUser } from '../model/User'
interface IRoleCheckerProps {
  role: string
  currentUser: IUser
}

function RoleChecker(props: IRoleCheckerProps) {
  return (
    <div>
      {props.role === 'Anonymous' ? (
        <Anonymous currentUser={props.currentUser} currentRole={props.role} />
      ) : props.role === 'Junior License Processor' ? (
        <h1>Junior License Processor</h1>
      ) : props.role === 'Senior License Processor' ? (
        <h1>Senior License Processor</h1>
      ) : props.role === 'Supervisor' ? (
        <h1>Supervisor</h1>
      ) : props.role === 'Admin Assistant' ? (
        <h1>Admin Assistant</h1>
      ) : props.role === 'Administrator' ? (
        <h1>Administrator</h1>
      ) : (
        <h1>none</h1>
      )}
    </div>
  )
}

export default observer(RoleChecker)
