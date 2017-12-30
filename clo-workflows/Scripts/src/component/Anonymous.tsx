import * as React from "react"
import { IUser } from "../model/User"

interface IAnonymousProps {
  currentUser: IUser
}

export class Anonymous extends React.Component<IAnonymousProps> {
  render() {
    const { currentUser } = this.props
    return (
      <div>
        Anonymous UI goes here...
      </div>
    )
  }
}
