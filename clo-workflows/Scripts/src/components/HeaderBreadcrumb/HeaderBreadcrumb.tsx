import * as React from "react"
import { observer } from "mobx-react"
import { autobind } from "core-decorators"
import { DefaultButton, Breadcrumb, IBreadcrumbItem } from "office-ui-fabric-react/lib/"
import "./styles.scss"

export interface IHeaderBreadcrumbProps {
    items: IBreadcrumbItem[]
    onClickItem: (breadcrumbKey: string) => void
}

interface IHeaderBreadcrumbState {
    hoverBreadcrumbKey: string
}

@autobind
@observer
export default class HeaderBreadcrumb extends React.Component<IHeaderBreadcrumbProps, IHeaderBreadcrumbState> {
    constructor(props: IHeaderBreadcrumbProps) {
        super(props)
        this.state = { hoverBreadcrumbKey: NONE_SELECTED }
    }

    public render() {
        return (
            <div className="headerBreadcrumb-wrapper-styles">
                <Breadcrumb
                    items={this.props.items}
                    onRenderItem={this.renderBreadcrumbItem}
                    ariaLabel={"Website breadcrumb"}
                />
            </div>
        )
    }

    private renderBreadcrumbItem(item: IBreadcrumbItem) {
        return (
            <div>
                <DefaultButton
                    text={item.text}
                    onClick={() => this.props.onClickItem(item.key)}
                    className="headerBreadcrumb-breadcrumbItem-styles"
                    style={this.getBreadcrumbButtonStyle(item.key)}
                    onMouseEnter={() => this.setState({ hoverBreadcrumbKey: item.key })}
                    onMouseLeave={() => this.setState({ hoverBreadcrumbKey: NONE_SELECTED })}
                />
            </div>
        )
    }

    private getBreadcrumbButtonStyle(itemKey: string) {
        return itemKey === this.state.hoverBreadcrumbKey ? { backgroundColor: "#F0F0F0" } : {}
    }
}

// key indicating no breadcrumb is currently being hovered over
const NONE_SELECTED = "NONE_SELECTED"
