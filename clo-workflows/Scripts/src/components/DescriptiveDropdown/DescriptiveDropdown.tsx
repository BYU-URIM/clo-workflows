import * as React from "react"
import { observer } from "mobx-react"
import { Dropdown, IDropdownProps } from "office-ui-fabric-react/lib/Dropdown"

export interface IDescriptiveDropdownProps extends IDropdownProps {
    description: string
}

function DescriptiveDropdown(props: IDescriptiveDropdownProps): JSX.Element {
    return (
        <div>
            <Dropdown {...props} />
            <span className="descriptiveDropdown-description-styles">{props.description}</span>
        </div>
    )
}

export default observer(DescriptiveDropdown)
