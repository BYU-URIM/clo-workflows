import * as React from "react"
import { observer } from "mobx-react"
import { IFormControl } from "../model/FormControl"
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"

// "text" | "choice" | "checkbox" | "textarea" | "datetime" | "number"
interface IFormControlGroupProps {
    model: {}
    formControls: Array<IFormControl>
    validation: {}
    onChange: (fieldName: string, newVal: any) => void
}

// renders an array of form controls which pull their information from the model object in props
function FormControlGroup(props: IFormControlGroupProps) {
    return (
        <div>
        {
            props.formControls.map(formControl => {
                if(formControl.type === "text"  || formControl.type === "datetime" || formControl.type === "number") {
                    return <TextField value={props.model[formControl.modelRef]} errorMessage={props.validation[formControl.modelRef]}
                                onChanged={(newVal: string) => props.onChange(formControl.modelRef, newVal) } label={formControl.displayName} />
                } else if(formControl.type === "choice") {
                    return <Dropdown options={formControl.choices.map(choice => ({key: choice, text: choice}))} selectedKey={props.model[formControl.modelRef]}
                                onChanged={(option: IDropdownOption) => props.onChange(formControl.modelRef, option.text)} label={formControl.displayName} />
                } else if(formControl.type === "textarea") {
                    return <TextField multiline value={props.model[formControl.modelRef]} errorMessage={props.validation[formControl.modelRef]}
                                onChange={(e) => props.onChange(formControl.modelRef, e.currentTarget.value)} label={formControl.displayName} />
                } else if(formControl.type === "checkbox") {
                    return <Checkbox checked={props.model[formControl.modelRef]} label={formControl.displayName}
                                onChange={(e: React.FormEvent<HTMLElement>, isChecked: boolean) => props.onChange(formControl.modelRef, isChecked)} />
                } else {
                    return <div>unrecognized form control type</div>
                }
            })
        }
        </div>
    )
}

export default observer(FormControlGroup)
