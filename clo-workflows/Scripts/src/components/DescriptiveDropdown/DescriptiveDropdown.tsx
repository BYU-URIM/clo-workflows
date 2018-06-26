import * as React from "react"
import { observer } from "mobx-react"
import { IDropdownProps, Dropdown } from "office-ui-fabric-react/lib/"
import "./styles.scss"

export interface IDescriptiveDropdownProps extends IDropdownProps {
    description: string
}

export const DescriptiveDropdown = observer(
    (props: IDescriptiveDropdownProps): JSX.Element => {
        return (
            <div>
                <Dropdown {...props} />
                <span className="descriptiveDropdown-description-styles">{props.description}</span>
            </div>
        )
    }
)
