import * as React from 'react'
import { observer } from 'mobx-react'

interface IRoleCheckerProps {
  role: string
}

function RoleChecker(props: IRoleCheckerProps) {
  return (
    <div>
  {props.role === "anonymous" ? <h1>anonymous</h1>: props.role === "Junior License Processor" ? <h1>Junior License Processor</h1>: props.role === "Senior License Processor" ? <h1>Senior License Processor</h1>: props.role === "Supervisor" ? <h1>Supervisor</h1>: props.role === "Admin Assistant" ? <h1>Admin Assistant</h1>:props.role === "Administrator" ? <h1>Administrator</h1>:<h1>none</h1>}
    </div>
  )
}

export default observer(RoleChecker)
