import * as React from "react"
import { observer } from "mobx-react"
import { IFormControl } from "../model/FormControl"
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown"
import DescriptiveDropdown from "./DescriptiveDropdown"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { FormEntryType } from "../model/CloRequestElement"
import { ObservableMap } from "mobx"
import DescriptiveCheckbox from "./DescriptiveCheckbox"

interface IFormControlGroupProps {
    data: ObservableMap<FormEntryType> // map of fieldName to fieldValue
    formControls: Array<IFormControl>
    validation: {}
    onChange: (fieldName: string, newVal: FormEntryType) => void
    getFormControlDescription?: (formControl: IFormControl) => string // custom logic to compute a description given a form control
    width?: number | string
}

const styles = {
    width: "450px",
    margin: "0 0",
}

const checkboxStyles = { margin: "20 0" }

const disabledInputBackground = { backgroundColor: "#F0F0F0" }

// renders an array of form controls which pull their information from the model object in props
function FormControlGroup(props: IFormControlGroupProps) {
    return (
        <div style={props.width ? Object.assign({}, styles, {width: props.width}) : styles }>
            {props.formControls &&
                props.formControls.map((formControl, index) => {
                    if (formControl.type === "text" || formControl.type === "datetime" || formControl.type === "number") {
                        return (
                            <TextField
                                value={props.data.get(formControl.dataRef) as string || ""}
                                errorMessage={props.validation[formControl.dataRef]}
                                onChanged={(newVal: string) => props.onChange(formControl.dataRef, newVal)}
                                label={formControl.displayName}
                                key={index}
                                disabled={formControl.readonly}
                                style={formControl.readonly && disabledInputBackground }
                                description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                            />
                        )
                    } else if (formControl.type === "choice") {
                        return (
                            <DescriptiveDropdown
                                options={formControl.choices.map(choice => ({ key: choice, text: choice }))}
                                selectedKey={props.data.get(formControl.dataRef) as string}
                                onChanged={(option: IDropdownOption) => props.onChange(formControl.dataRef, option.text)}
                                label={formControl.displayName}
                                key={index}
                                disabled={formControl.readonly}
                                description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                            />
                        )
                    } else if (formControl.type === "textarea") {
                        return (
                            <TextField
                                multiline
                                value={props.data.get(formControl.dataRef) as string || ""}
                                errorMessage={props.validation[formControl.dataRef]}
                                key={index}
                                onChanged={(newVal: string) => props.onChange(formControl.dataRef, newVal)}
                                label={formControl.displayName}
                                disabled={formControl.readonly}
                                style={formControl.readonly && disabledInputBackground }
                                description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                            />
                        )
                    } else if (formControl.type === "checkbox") {
                        return (
                            <div style={checkboxStyles} key={index}>
                                <DescriptiveCheckbox
                                    checked={props.data.get(formControl.dataRef) === "true" ? true : false}
                                    label={formControl.displayName}
                                    onChange={(e: React.FormEvent<HTMLElement>, isChecked: boolean) =>
                                        props.onChange(formControl.dataRef, String(isChecked))
                                    }
                                    disabled={formControl.readonly}
                                    description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                />
                            </div>
                        )
                    } else {
                        return <div key={index}>unrecognized form control type</div>
                    }
                })}
        </div>
    )
}

export default observer(FormControlGroup)
