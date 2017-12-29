import * as React from "react"
import { IUser } from "../model/User"
import {RoleSteps} from "../component/RoleStepsComponents/RoleSteps"

interface IRoleRenderContainerProps {
	currentUser: IUser
}

export class RoleRenderContainer extends React.Component<IRoleRenderContainerProps> {
	render() {
		let { currentUser } = this.props
		return (
			<div>
				<RoleSteps currentUser={currentUser} />
			</div>
		)
	}
}
