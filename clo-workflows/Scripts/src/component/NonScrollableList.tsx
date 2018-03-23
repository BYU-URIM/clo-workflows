import * as React from "react"
import { observer } from "mobx-react"
import { autobind } from "core-decorators"
import { List } from "office-ui-fabric-react/lib/List"
import Header from "./Header"
import { IconButton } from "office-ui-fabric-react"

export interface IListItem {
    header: string
    subheader?: string
    body: string
    id: string | number
    selectable?: boolean
    editable?: boolean
    deletable?: boolean
}

interface INonScrollableListProps {
    items: Array<IListItem>
    style?: {}
    // onSelectItem will only work if listItem.selectable = true (see IListItem interface)
    onSelectItem?: (listItem: IListItem, itemIndex: number) => void
    // onEditItem will only work if listItem.editable = true (see IListItem interface)
    onEditItem?: (listItem: IListItem, itemIndex: number) => void
    // onDeleteItem will only work if listItem.deletable = true (see IListItem interface)
    onDeleteItem?: (listItem: IListItem, itemIndex: number) => void
}

interface IProcessListState {
    hoverItemIndex: number
}

const listItemStyles = {
    borderBottom: "1px inset #505050",
    padding: "13 0",
}

const listStyles = { maxWidth: 400, padding: 0 }
const listItemBodyStyles = { font: "18px Segoe UI, sans-serif" }

const listItemTitleStyles = {
    font: "20px Segoe UI, sans-serif",
    color: "#202020",
    fontWeight: 200,
    marginRight: 15
} as React.CSSProperties

const listItemSubheaderStyles = {
    font: "12px Segoe UI, sans-serif",
    color: "#A9A9A9",
    marginBottom: 10,
}

const listItemHeaderStyles = { display: "flex" } as React.CSSProperties

@autobind
@observer
export class NonScrollableList extends React.Component<INonScrollableListProps, IProcessListState> {
    constructor(props) {
        super(props)
        this.state = { hoverItemIndex: -1 }
    }

    public render() {
        const { props } = this
        return (
            <div style={this.props.style}>
                <ul style={listStyles}>
                    {props.items.map((item, index) => (
                        <div
                            key={index}
                            style={this.getListItemStyle(index)}
                            onMouseLeave={item.selectable ? this.onMouseLeaveListItem : null}
                            onMouseEnter={item.selectable ? () => this.onMouseEnterListItem(index) : null}
                            onClick={item.selectable && props.onSelectItem ? () => this.props.onSelectItem(item, index) : null}
                        >
                            <div style={listItemHeaderStyles}>
                                <div style={listItemTitleStyles}>{item.header}</div>
                                {   item.editable &&
                                    <IconButton
                                        iconProps={ {iconName: "edit"} }
                                        onClick={() => props.onEditItem(item, index)}
                                    />
                                }
                                {
                                    item.deletable &&
                                    <IconButton
                                        iconProps={ {iconName: "delete"} }
                                        onClick={() => props.onDeleteItem(item, index)}
                                    />
                                }
                            </div>
                            <div style={listItemSubheaderStyles}>{item.subheader}</div>
                            <div>{item.body}</div>
                        </div>
                    ))}
                </ul>
            </div>
        )
    }

    private getListItemStyle(index: number) {
        return this.state.hoverItemIndex === index
        ? { ...listItemStyles, ...{ backgroundColor: "#F0F0F0", cursor: "pointer" } } // highlighted color
        : listItemStyles // resting color
    }

    private onMouseLeaveListItem() {
        this.setState({ hoverItemIndex: -1 })
    }

    private onMouseEnterListItem(index: number) {
        this.setState({ hoverItemIndex: index })
    }
}
