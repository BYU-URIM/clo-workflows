import * as React from "react"
import { observer } from "mobx-react"
import { IFormControl } from "../model/FormControl"
import { Dropdown, IDropdownOption } from "office-ui-fabric-react/lib/Dropdown"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
import { FormEntryType } from "../model/CloRequestElement"
import { ObservableMap } from "mobx"

interface IFormControlGroupProps {
    data: ObservableMap<FormEntryType>
    formControls: Array<IFormControl>
    validation: {}
    onChange: (fieldName: string, newVal: FormEntryType) => void
}

const styles = {
    width: "450px",
    margin: "0 20",
}

const checkboxStyles = {
    margin: "20 0",
}

// renders an array of form controls which pull their information from the model object in props
function FormControlGroup(props: IFormControlGroupProps) {
    return (
        <div style={styles}>
        {
            props.formControls && props.formControls.map((formControl, index) => {
                if(formControl.type === "text"  || formControl.type === "datetime" || formControl.type === "number") {
                    return <TextField value={props.data.get(formControl.dataRef) as string} errorMessage={props.validation[formControl.dataRef]}
                                onChanged={(newVal: string) => props.onChange(formControl.dataRef, newVal) } label={formControl.displayName} key={index} />
                } else if(formControl.type === "choice") {
                    return <Dropdown options={formControl.choices.map(choice => ({key: choice, text: choice}))} selectedKey={props.data.get(formControl.dataRef) as string}
                                onChanged={(option: IDropdownOption) => props.onChange(formControl.dataRef, option.text)} label={formControl.displayName} key={index} />
                } else if(formControl.type === "textarea") {
                    return <TextField multiline value={props.data.get(formControl.dataRef) as string} errorMessage={props.validation[formControl.dataRef]} key={index}
                                onChange={(e) => props.onChange(formControl.dataRef, e.currentTarget.value)} label={formControl.displayName} />
                } else if(formControl.type === "checkbox") {
                    return <div style={checkboxStyles} key={index}>
                                <Checkbox checked={props.data.get(formControl.dataRef) as boolean} label={formControl.displayName}
                                    onChange={(e: React.FormEvent<HTMLElement>, isChecked: boolean) => props.onChange(formControl.dataRef, isChecked)} />
                            </div>
                } else {
                    return <div key={index} >unrecognized form control type</div>
                }
            })
        }
        </div>
    )
}

export default observer(FormControlGroup)
