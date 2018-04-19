import * as React from "react"
import { observer } from "mobx-react"
import { IListItem, NonScrollableList } from "./NonScrollableList"

const wrapperStyle = {
    margin: "80px 32px 80px 32px",
    background: "#F8F8F8",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    padding: "20px",
    width: "500px"
}
const textStyle = {
    font: "20px Segoe UI, sans-serif",
    color: "#202020",
    fontWeight: 200,
    textAlign: "center",
    marginTop: "20px"
} as React.CSSProperties

const processListTitleStyles = {
    textAlign: "center",
    font: "26px Segoe UI, sans-serif",
    marginBottom: "8px",
} as React.CSSProperties

interface IProcessBriefListProps {
    processBriefs: IListItem[]
    title: string
    emptyMessage: string
    onSelectProcessBrief: (listItem: IListItem, itemIndex: number) => void
}

function ProcessBriefList(props: IProcessBriefListProps): JSX.Element {
    return (
        <div style={wrapperStyle}>
            <div style={processListTitleStyles}>{props.title}</div>
            {props.processBriefs.length ? (
                <NonScrollableList
                    items={props.processBriefs}
                    onSelectItem={props.onSelectProcessBrief}
                />
            ) : (
                <div style={textStyle}>{props.emptyMessage}</div>
            )}
        </div>
    )
}

export default observer(ProcessBriefList)
