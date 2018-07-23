import * as React from "react"
import { observer } from "mobx-react"
import { IDropdownProps, Dropdown } from "office-ui-fabric-react/lib/"
import "./styles.scss"

export interface IDescriptiveDropdownProps extends IDropdownProps {
    description: string
    descriptionClassName?: string
}

export const DescriptiveDropdown = observer(
    (props: IDescriptiveDropdownProps): JSX.Element => {
        return (
            <div>
                <Dropdown {...props} />
                <span
                    className={
                        props.descriptionClassName
                            ? `${props.descriptionClassName} descriptiveDropdown-description-styles`
                            : "descriptiveDropdown-description-styles"
                    }
                >
                    {props.description}
                </span>
            </div>
        )
    }
)
