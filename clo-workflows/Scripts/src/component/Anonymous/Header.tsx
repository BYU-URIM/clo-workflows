import React = require('react')
import { IUser } from '../../model/User'
import {
  Persona,
  PersonaInitialsColor
} from 'office-ui-fabric-react/lib/Persona'
interface IHeaderProps {
  currentUser: IUser
  currentRole:string
}
const styles = {
	background:'lightgrey',
	margin: '10px',
	padding: '10px'
}
const Header = (props: IHeaderProps) => {
  return (
    <div style={styles}>
		 <h1>CLO Workflows Role: <u>{props.currentRole}</u></h1>
      <Persona
        secondaryText={props.currentUser.username}
        primaryText={props.currentUser.name}
      />
    </div>
  )
}
export default Header
