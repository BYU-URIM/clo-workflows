import * as React from "react"
import { observer } from "mobx-react"
import { ICheckboxProps } from "office-ui-fabric-react"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"

import "./styles.css"
export interface IDescriptiveCheckboxProps extends ICheckboxProps {
    description: string
}

function DescriptiveCheckbox(props: IDescriptiveCheckboxProps): JSX.Element {
    return (
        <div>
            <Checkbox {...props} />
            <span className="descriptiveCheckbox-description-styles">{props.description}</span>
        </div>
    )
}

export default observer(DescriptiveCheckbox)
