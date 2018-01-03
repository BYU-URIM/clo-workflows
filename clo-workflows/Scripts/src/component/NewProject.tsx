import * as React from 'react'
import {IUser} from '../model/User';
import {Work} from './Work';
import {IArticleWork, WorkType} from '../model/Work';
import Header from './Header';
interface INewProjectProps{
  currentUser: IUser
}
const workType: Array<WorkType> = ["Article", "Book", "Book Chapter", "Image", "Music", "Other", "Video", "Website"]

export class NewProject extends React.Component<INewProjectProps> {
  render(){
    return(
    <div>
      <Header currentUser = {this.props.currentUser} />
      <Work workType={workType}/>  
    </div>
    )
  }
}