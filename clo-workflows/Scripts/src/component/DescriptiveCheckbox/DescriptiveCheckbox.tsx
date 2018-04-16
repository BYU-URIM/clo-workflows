import * as React from "react"
import { observer } from "mobx-react"
import { ICheckboxProps } from "office-ui-fabric-react"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"

export interface IDescriptiveCheckboxProps extends ICheckboxProps {
    description: string
}

const descriptionStyles = {
    color: "#666666",
    fontSize: "11px"
}

function DescriptiveCheckbox(props: IDescriptiveCheckboxProps): JSX.Element {
    return (
        <div>
            <Checkbox {...props} />
            <span style={descriptionStyles} >{props.description}</span>
        </div>
    )
}

export default observer(DescriptiveCheckbox)
