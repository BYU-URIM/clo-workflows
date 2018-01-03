import * as React from "react"
import { IUser } from "../model/User"
import {IProject} from "../model/Project";
import { PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
interface IExistingProjectsProps {
  currentUser: IUser
  currentUserProjects: Array<IProject>
}

export class ExistingProjects extends React.Component<IExistingProjectsProps> {
  render() {
    const { currentUser, currentUserProjects } = this.props
    return (
      <div>
        {
          <ExistingPoject />
        }
      </div>
    )
  }
}


const ExistingPoject = () =>{
  return(
    <div className='ms-BasicButtonsExample'>
    <Label>Click the button to insert text.</Label>
    <PrimaryButton
      data-automation-id='test'
      text='Insert text...'
      onClick={ this.insertText }
    />
  </div>
  )
}