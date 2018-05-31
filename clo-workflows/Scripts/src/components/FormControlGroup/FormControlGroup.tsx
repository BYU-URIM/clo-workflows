import * as React from "react"
import { observer } from "mobx-react"
import { FormControl, FormEntryType } from "../../model"
import { DescriptiveDropdown, DescriptiveCheckbox } from "../"
import { TextField, IDropdownOption } from "office-ui-fabric-react"
import { ObservableMap } from "mobx"
import "./styles.scss"
interface IFormControlGroupProps {
    data: ObservableMap<FormEntryType> // map of fieldName to fieldValue
    formControls: Array<FormControl>
    validation: {}
    updateFormField: (fieldName: string, newVal: FormEntryType) => void
    // custom logic to compute a description given a form control
    getFormControlDescription?: (formControl: FormControl) => string
    width?: number | string
}

// renders an array of form controls which pull their information from the model object in props
class FormControlGroup extends React.Component<IFormControlGroupProps, {}> {
    public constructor(props: IFormControlGroupProps) {
        super(props)
        this.applyDefaultValues()
    }

    /**
     * this componenet represents the union of formControls and form data,
     * when this connection occurs (on construction)
     * the default values (form form controls) need to be applied to the form data
     */
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
        const props = this.props
        return (
            <div className="formControlGroup-styles" style={props.width && { width: props.width }}>
                {props.formControls &&
                    props.formControls.map((formControl, index) => {
                        if (formControl.type === "text" || formControl.type === "datetime" || formControl.type === "number") {
                            return (
                                <div className="formControlGroup-formControl-styles" key={index}>
                                    <TextField
                                        value={(props.data.get(formControl.dataRef) as string) || ""}
                                        onChanged={(newVal: string) => props.updateFormField(formControl.dataRef, newVal)}
                                        label={formControl.displayName}
                                        disabled={formControl.readonly}
                                        className={formControl.readonly ? "formControlGroup-disabledInputBackground" : ""}
                                        description={
                                            formControl.description ||
                                            (props.getFormControlDescription && props.getFormControlDescription(formControl))
                                        }
                                        onBlur={() => formControl.touch()}
                                        errorMessage={props.validation[formControl.dataRef]}
                                    />
                                </div>
                            )
                        } else if (formControl.type === "choice") {
                            return (
                                <div className="formControlGroup-formControl-styles" key={index}>
                                    <DescriptiveDropdown
                                        options={formControl.choices.map(choice => ({ key: choice, text: choice }))}
                                        selectedKey={props.data.get(formControl.dataRef) as string}
                                        onChanged={(option: IDropdownOption) => props.updateFormField(formControl.dataRef, option.text)}
                                        label={formControl.displayName}
                                        disabled={formControl.readonly}
                                        description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                        onBlur={() => formControl.touch()}
                                        errorMessage={props.validation[formControl.dataRef]}
                                    />
                                </div>
                            )
                        } else if (formControl.type === "textarea") {
                            return (
                                <div className="formControlGroup-formControl-styles" key={index}>
                                    <TextField
                                        multiline
                                        value={(props.data.get(formControl.dataRef) as string) || ""}
                                        onChanged={(newVal: string) => props.updateFormField(formControl.dataRef, newVal)}
                                        label={formControl.displayName}
                                        disabled={formControl.readonly}
                                        className={formControl.readonly ? "formControlGroup-disabledInput-styles" : ""}
                                        description={props.getFormControlDescription && props.getFormControlDescription(formControl)}
                                        onBlur={() => formControl.touch()}
                                        errorMessage={props.validation[formControl.dataRef]}
                                    />
                                </div>
                            )
                        } else if (formControl.type === "checkbox") {
                            return (
                                <div className="formControlGroup-checkbox-styles" key={index}>
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
