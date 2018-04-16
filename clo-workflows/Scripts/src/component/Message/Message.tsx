import * as React from "react"
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar"

interface IMessageProps {
    messageText: string
    messageType: MessageType
}

type MessageType = "success" | "error"


const wrapperStyles = {
    display: "flex",
    justifyContent: "center"
} as React.CSSProperties

const messageStyles = {
    width: "50%",
    position: "fixed",
    bottom: "0px"
} as React.CSSProperties

const Message = (props: IMessageProps) => (
    <div style={wrapperStyles}>
        <div style={messageStyles}>
            <MessageBar
                messageBarType={getMessageBarType(props.messageType)}>
                {props.messageText}
            </MessageBar>
        </div>
    </div>
)

export default Message

// the custom message type that maps to MessageBarTypes is repetitive, it mirrors office-ui-fabric/MessageBarType
// however, if any fabric moduels are imported into stores, it breaks tests. This means I have to make my own mapping logic and use that instead
// TODO fix and figure out how not to break tests
function getMessageBarType(messageType: MessageType): MessageBarType {
    switch(messageType) {
        case "success": return MessageBarType.success
        case "error": return MessageBarType.error
    }
}
