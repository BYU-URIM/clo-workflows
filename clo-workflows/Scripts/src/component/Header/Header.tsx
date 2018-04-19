import * as React from "react"
import { IUser } from "../../model"
import { Persona, PersonaInitialsColor, Toggle } from "office-ui-fabric-react"
export interface IHeaderProps {
    currentUser: IUser
    clientMode: boolean
    toggleClientMode(): void
}

const wrapperStyles = {
    backgroundColor: "#E8E8E8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
} as React.CSSProperties

const personaStyles = {
    marginTop: 18,
}

const titleStyles = {
    font: "65px Segoe UI, sans-serif",
    color: "#686868",
    margin: "0 10% 0 30%",
    alignSelf: "center",
} as React.CSSProperties

const Header = (props: IHeaderProps) => {
    const { currentUser } = props
    return (
        <div style={wrapperStyles}>
            <div style={titleStyles}>Licensing Task Tracker</div>
            <div style={personaStyles}>
                <Persona
                    size={4}
                    initialsColor="#0078d7"
                    primaryText={currentUser.name}
                    secondaryText={`${currentUser.username} - ${currentUser.primaryRole.name}`}
                />
            </div>
            <Toggle label="Client Mode" checked={props.clientMode} onClick={props.toggleClientMode} />
        </div>
    )
}
export default Header
