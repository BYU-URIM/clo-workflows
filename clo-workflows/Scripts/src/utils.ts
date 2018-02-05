import { IFormControl } from "./model/FormControl"
import { FormEntryType } from "./model/CloRequestElement"

export function deepCopy<T>(ob: T): T {
    return JSON.parse(JSON.stringify(ob))
}

const NUMBER_REGEX = /[1-9]+[0-9]*/ // regex specifying integer values
const NUMBER_INPUT_ERROR = "please enter a number"

const DATE_REGEX = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/ // regex specifying mm/dd/yyyy date format
const DATE_INPUT_ERROR = "please enter a date: mm/dd/yyyy"

export function validateFormControl(formControl: IFormControl, value: FormEntryType): string {
    if (formControl.type === "number" && !NUMBER_REGEX.test(value as string)) {
        return NUMBER_INPUT_ERROR
    }

    if (formControl.type === "datetime" && !DATE_REGEX.test(value as string)) {
        return DATE_INPUT_ERROR
    }
}
