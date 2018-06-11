import * as React from "react"
import { observer } from "mobx-react"
import { autobind } from "core-decorators"
import { IconButton, Pivot, PivotItem, PivotLinkFormat, PivotLinkSize, SearchBox } from "office-ui-fabric-react/lib/"
import "./styles.scss"
import { Item } from "@pnp/sp"
export interface IListItem {
    header: string
    subheader?: string
    body: string
    id: string | number
    selectable?: boolean
    editable?: boolean
    deletable?: boolean
}

interface ISearchListProps {
    items: Array<IListItem>
    selectedItem: string
    search(searchTerm: string)
    onSelectItem?: (listItem: IListItem, itemIndex: number) => void
    typeSelected: boolean
    emptyMessage: string
}

const SearchList = (props: ISearchListProps) => {
    const getListItemStyle = (id: string) => {
        return id === props.selectedItem ? { backgroundColor: "#dadada", cursor: "pointer" } : {}
    }
    return (
        <div className={"pivot-tab"}>
            {props.typeSelected && (
                <div>
                    <SearchBox placeholder="search by work Title" onSearch={props.search} />
                    <ul className="list-styles">
                        {props.items.length > 0 ? (
                            props.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="listItem-styles"
                                    style={getListItemStyle(item.id.toString())}
                                    onClick={item.selectable && props.onSelectItem ? () => props.onSelectItem(item, index) : null}
                                >
                                    <div className="listItemHeader-styles">
                                        <div className="listItemTitle-styles">{item.header}</div>
                                    </div>
                                    <div className="listItemSubheader-styles">{item.subheader}</div>
                                    <div>{item.body}</div>
                                </div>
                            ))
                        ) : (
                            <div className="listItem-styles">
                                <div className="listItemHeader-styles">
                                    <div className="listItemTitle-styles">{props.emptyMessage}</div>
                                </div>
                                <div className="listItemEmpty-styles">If you can't find the work you're requesting you can add it as a new work</div>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SearchList
