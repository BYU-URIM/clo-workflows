import * as React from "react"
import { observer } from "mobx-react"
import { Checkbox } from "office-ui-fabric-react/lib/"
import { ICheckboxProps } from "office-ui-fabric-react"
export interface IDescriptiveCheckboxProps extends ICheckboxProps {
    description: string
}
import "./styles.scss"

export const DescriptiveCheckbox = observer(
    (props: IDescriptiveCheckboxProps): JSX.Element => {
        return (
            <div>
                <Checkbox {...props} />
                <span className="descriptiveCheckbox-description-styles">{props.description}</span>
            </div>
        )
    }
)
