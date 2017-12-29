import * as React from "react"
import { IUser } from "../../model/User"
interface IRoleStepsProps {
  currentUser: IUser
}
const styles = {
  border: "solid 2px black",
  margin: "25px",
  padding: "10px",
}
export const RoleSteps = (props: IRoleStepsProps) => {
  return (
    <div>
      {props.currentUser.role.permittedSteps.map(step => (
        <div key={`${step.name}-${step.processFormControls.length}`} style={styles}>
          <h2>{step.name}</h2>
          <ul>
            {step.processFormControls.map(formControl => (
              <li key={`${step.name}-${formControl.displayName}`}>{formControl.displayName}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
