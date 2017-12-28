import * as React from 'react'
import {IUser} from '../../model/User';
interface ICreateNewProject {
	currentUser: IUser
 }
const styles={
	border: 'solid 2px black',
	margin: '25px', 
	padding: '10px'
} 
const CreateNewProject = (props: ICreateNewProject) =>{
	return(
		<div style={styles}>	
			<h2>Create New Project</h2>
			
		</div>
	)
}

export default CreateNewProject