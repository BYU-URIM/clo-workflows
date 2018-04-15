import { FormControl } from "../model/FormControl"
import { FormEntryType, CloRequestElement, IdentifiableObject } from "../model/CloRequestElement"
import { observable, action, ObservableMap } from "mobx"

class StoreUtils {
    private static REQUIRED_INPUT_ERROR = "this value is required"
    /* regex specifying integer values */
    private static NUMBER_REGEX = /^[1-9]+[0-9]*$/
    private static NUMBER_INPUT_ERROR = "please enter a number"
    /* regex specifying mm/dd/yyyy date format */
    private static DATE_REGEX = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/
    private static DATE_INPUT_ERROR = "please enter a date: mm/dd/yyyy"

    validateFormControl = (formControl: FormControl, value: FormEntryType): string => {
        if(formControl.touched) {
        if(formControl.touched && formControl.required && !value) {
            return StoreUtils.REQUIRED_INPUT_ERROR
        }

        if (value && formControl.type === "number" && !StoreUtils.NUMBER_REGEX.test(value as string)) {
            return StoreUtils.NUMBER_INPUT_ERROR
        }

        if (value && formControl.type === "datetime" && !StoreUtils.DATE_REGEX.test(value as string)) {
            return StoreUtils.DATE_INPUT_ERROR
        }
        }
    }

    // returns plain javascript object mapping field names to error strings
    validateFormControlGroup(formControls: FormControl[], formValues: ObservableMap<FormEntryType>): {} {
        return formControls.reduce((accumulator: {}, formControl: FormControl) => {
            const fieldName: string = formControl.dataRef
            const inputVal = formValues.get(fieldName)
            const error = this.validateFormControl(formControl, inputVal)
            if(error) {
                accumulator[fieldName] = error
            }
            return accumulator
        }, {})
    }

    getClientObsMap = (userId: string): ObservableMap<string> => {
        return observable.map([["submitterId", userId]])
    }

    mapRequestElementArrayById(requestElementArray: CloRequestElement[]): ObservableMap<CloRequestElement> {
        return requestElementArray.reduce((requestElementMap, requestElement) => {
            requestElementMap.set(String(requestElement.Id), requestElement)
            return requestElementMap
        }, new ObservableMap<CloRequestElement>())
    }

    @action
    replaceElementInListById(newItem: IdentifiableObject, list: IdentifiableObject[]): boolean {
        const staleItemIndex = list.findIndex(listItem => listItem["Id"] === newItem["Id"])

        if(staleItemIndex !== -1) {
            list[staleItemIndex] = newItem
            return true
        }
        return false
    }
}

export default new StoreUtils()
