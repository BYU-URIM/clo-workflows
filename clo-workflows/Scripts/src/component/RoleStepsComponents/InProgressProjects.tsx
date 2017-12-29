import * as React from 'react'
import { IUser } from '../../model/User'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image'
import {
  DetailsList,
  buildColumns,
  IColumn
} from 'office-ui-fabric-react/lib/DetailsList'
import { InProgressList } from './DetailsList'
interface IInProgressProjectsProps {
  currentUser: IUser
}
const styles = {
  border: 'solid 2px black',
  margin: '25px',
  padding: '10px'
}
const InProgressProjects = (props: IInProgressProjectsProps) => {
  return (
    <div style={styles}>
      <h2>In Progress Projects</h2>
      <InProgressList />
    </div>
  )
}

export default InProgressProjects
