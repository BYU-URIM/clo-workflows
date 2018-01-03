import * as React from 'react'
import {IUser} from '../model/User';
import {Work} from './Work';
import {IArticleWork, WorkType} from '../model/Work';
import Header from './Header';
interface INewProjectProps{
  currentUser: IUser
}
const workType: Array<WorkType> = ["Article", "Book", "Book Chapter", "Image", "Music", "Other", "Video", "Website"]
const work: IArticleWork = {
  type:"Article",
  id: 12345,
  course: "some course",
  format: "print",
  title: "A super lame article",
  author:"george washington",
  publisher: "Random House",
  yearPublished: "1999",
  journalTitle: "a boring journal",
  edition: "3rd",
  formatInformation: "nothing special",
  callNumber: "1355476",
  ISSN: 123456789,
  volume: 3,
  issue: "some issue",
  pageRange: "100-200",
  totalPages: 1000,
  URL: "www.url.com",
  hardCopyOwner: "Mr. Obama",
 
}
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