import * as React from 'react'
import {IUser} from "../model/User"

interface IIsEmployeeProps{
    currentUser: IUser
}

export class IsEmployee extends React.Component<IIsEmployeeProps> {
  render(){
      const {currentUser} = this.props 
    return(
    <div>
        {}
    </div>
    )
  }
}