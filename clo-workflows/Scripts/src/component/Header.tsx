import React = require("react")
import { IUser } from "../model/User"
import { Persona, PersonaInitialsColor } from "office-ui-fabric-react/lib/Persona"
export interface IHeaderProps {
  currentUser: IUser
}
const styles = {
  background: "lightgray",
  margin: "20 48",
  padding: "15px",
  display: "inline-block",
}
const Header = (props: IHeaderProps) => {
  const { currentUser } = props
  return (
    <div style={styles}>
      <Persona
        size={5}
        initialsColor="navy"
        primaryText={currentUser.name}
        secondaryText={`${currentUser.username} - ${currentUser.role.name}`}
      />
    </div>
  )
}
export default Header
