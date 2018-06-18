import * as React from "react"
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/"
import "./styles.scss"

export interface IMessageProps {
    messageText: string
    messageType: MessageType
}

export type MessageType = "success" | "error"

export const Message = (props: IMessageProps) => (
    <div className="message-wrapper-styles">
        <div className="message-styles">
            <MessageBar messageBarType={MessageBarType[props.messageType]}>{props.messageText}</MessageBar>
        </div>
    </div>
)
