import * as React from "react"
import { observer } from "mobx-react"
// tslint:disable-next-line:no-submodule-imports
import { ICheckboxProps, Checkbox } from "office-ui-fabric-react"
import "./styles.scss"

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
