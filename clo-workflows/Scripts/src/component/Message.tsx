import * as React from "react"
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar"

export interface IMessageProps {
    messageText: string
    messageType: MessageBarType
}

const wrapperStyles = {
    display: "flex",
    justifyContent: "center"
} as React.CSSProperties

const messageStyles = {
    width: "50%",
    position: "fixed",
    bottom: "0px"
} as React.CSSProperties

export const Message = (props: IMessageProps) => (
    <div style={wrapperStyles}>
        <div style={messageStyles}>
            <MessageBar
                messageBarType={props.messageType}>
                {props.messageText}
            </MessageBar>
        </div>
    </div>
) 