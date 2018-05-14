import * as React from "react"
import { observer } from "mobx-react"
import { autobind } from "core-decorators"
import { IconButton } from "office-ui-fabric-react"
import "./styles.scss"
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

@autobind
@observer
export default class NonScrollableList extends React.Component<INonScrollableListProps, IProcessListState> {
    constructor(props) {
        super(props)
        this.state = { hoverItemIndex: -1 }
    }

    public render() {
        const props = this.props
        return (
            <div style={this.props.style}>
                <ul className="list-styles">
                    {props.items.map((item, index) => (
                        <div
                            key={index}
                            className="listItem-styles"
                            style={this.getListItemStyle(index)}
                            onMouseLeave={item.selectable ? this.onMouseLeaveListItem : null}
                            onMouseEnter={item.selectable ? () => this.onMouseEnterListItem(index) : null}
                            onClick={
                                item.selectable && props.onSelectItem
                                    ? () => this.props.onSelectItem(item, index)
                                    : null
                            }
                        >
                            <div className="listItemHeader-styles">
                                <div className="listItemTitle-styles">{item.header}</div>
                                {item.editable && (
                                    <IconButton
                                        iconProps={{ iconName: "edit" }}
                                        onClick={() => props.onEditItem(item, index)}
                                    />
                                )}
                                {item.deletable && (
                                    <IconButton
                                        iconProps={{ iconName: "delete" }}
                                        onClick={() => props.onDeleteItem(item, index)}
                                    />
                                )}
                            </div>
                            <div className="listItemSubheader-styles">{item.subheader}</div>
                            <div>{item.body}</div>
                        </div>
                    ))}
                </ul>
            </div>
        )
    }

    private getListItemStyle(index: number) {
        return this.state.hoverItemIndex === index ? { backgroundColor: "#F0F0F0", cursor: "pointer" } : {}
    }

    private onMouseLeaveListItem() {
        this.setState({ hoverItemIndex: -1 })
    }

    private onMouseEnterListItem(index: number) {
        this.setState({ hoverItemIndex: index })
    }
}
