import * as React from "react"
import { observer } from "mobx-react"
import { IListItem, NonScrollableList } from "../"
import "./styles.css"
interface IProcessBriefListProps {
    processBriefs: IListItem[]
    title: string
    emptyMessage: string
    onSelectProcessBrief: (listItem: IListItem, itemIndex: number) => void
}

function ProcessBriefList(props: IProcessBriefListProps): JSX.Element {
    return (
        <div className="processBriefList-wrapper-styles">
            <div className="processBriefList-processListTitle-styles">{props.title}</div>
            {props.processBriefs.length ? (
                <NonScrollableList items={props.processBriefs} onSelectItem={props.onSelectProcessBrief} />
            ) : (
                <div className="processBriefList-text-styles">{props.emptyMessage}</div>
            )}
        </div>
    )
}

export default observer(ProcessBriefList)
