import * as React from "react"
import { observer } from "mobx-react"
import { FormControl } from "../../model/FormControl"
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown"
import { DescriptiveDropdown, DescriptiveCheckbox } from "../"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { FormEntryType } from "../../model/CloRequestElement"
import { ObservableMap } from "mobx"

interface IFormControlGroupProps {
    data: ObservableMap<FormEntryType> // map of fieldName to fieldValue
    formControls: Array<FormControl>
    validation: {}
    updateFormField: (fieldName: string, newVal: FormEntryType) => void
    getFormControlDescription?: (formControl: FormControl) => string // custom logic to compute a description given a form control
    width?: number | string
}

const styles = {
    width: "450px",
    margin: "0 0",
}

const checkboxStyles = { margin: "20 0" }

const disabledInputBackground = { backgroundColor: "#F0F0F0" }

// renders an array of form controls which pull their information from the model object in props
class FormControlGroup extends React.Component<IFormControlGroupProps, {}> {
    public constructor(props: IFormControlGroupProps) {
        super(props)
        this.applyDefaultValues()
    }

    // because this componenet represents the union of formControls and form data, when this connection occurs (on construction)
    // the default values (form form controls) need to be applied to the form data
    private applyDefaultValues() {
        this.props.formControls.forEach(formControl => {
            const formValue = this.props.data[formControl.dataRef]
            const defaultValue = formControl.defaultValue
            if ((formValue === null || formValue === undefined) && (defaultValue !== null && defaultValue !== undefined)) {
                this.props.updateFormField(formControl.dataRef, formControl.defaultValue)
            }
        })
    }

    public render() {
        const { props } = this
        return (
            <div style={props.width ? Object.assign({}, styles, { width: props.width }) : styles}>
                {props.formControls &&
                    props.formControls.map((formControl, index) => {
                        if (formControl.type === "text" || formControl.type === "datetime" || formControl.type === "number") {
                            return (
                                <TextField
                                    value={(props.data.get(formControl.dataRef) as string) || ""}
                                    onChanged={(newVal: string) => props.updateFormField(formControl.dataRef, newVal)}
                                    label={formControl.displayName}
                                    key={index}
                                    disabled={formControl.readonly}
                                    style={formControl.readonly ? disabledInputBackground : null}
                                    description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                    onBlur={() => formControl.touch()}
                                    errorMessage={props.validation[formControl.dataRef]}
                                />
                            )
                        } else if (formControl.type === "choice") {
                            return (
                                <DescriptiveDropdown
                                    options={formControl.choices.map(choice => ({ key: choice, text: choice }))}
                                    selectedKey={props.data.get(formControl.dataRef) as string}
                                    onChanged={(option: IDropdownOption) => props.updateFormField(formControl.dataRef, option.text)}
                                    label={formControl.displayName}
                                    key={index}
                                    disabled={formControl.readonly}
                                    description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                    onBlur={() => formControl.touch()}
                                    errorMessage={props.validation[formControl.dataRef]}
                                />
                            )
                        } else if (formControl.type === "textarea") {
                            return (
                                <TextField
                                    multiline
                                    value={(props.data.get(formControl.dataRef) as string) || ""}
                                    key={index}
                                    onChanged={(newVal: string) => props.updateFormField(formControl.dataRef, newVal)}
                                    label={formControl.displayName}
                                    disabled={formControl.readonly}
                                    style={formControl.readonly ? disabledInputBackground : null}
                                    description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                    onBlur={() => formControl.touch()}
                                    errorMessage={props.validation[formControl.dataRef]}
                                />
                            )
                        } else if (formControl.type === "checkbox") {
                            return (
                                <div style={checkboxStyles} key={index}>
                                    <DescriptiveCheckbox
                                        checked={props.data.get(formControl.dataRef) === "true" ? true : false}
                                        label={formControl.displayName}
                                        onChange={(e: React.FormEvent<HTMLElement>, isChecked: boolean) =>
                                            props.updateFormField(formControl.dataRef, String(isChecked))
                                        }
                                        disabled={formControl.readonly}
                                        description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                        onBlur={() => formControl.touch()}
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
}

export default observer(FormControlGroup)
