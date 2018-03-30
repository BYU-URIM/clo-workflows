import { IFormControl } from "./model/FormControl"
import { FormEntryType, CloRequestElement } from "./model/CloRequestElement"
import { ObservableMap } from "mobx/lib/types/observablemap"
import { observable } from "mobx"

class Utils {
    deepCopy = <T>(ob: T): T => {
        return JSON.parse(JSON.stringify(ob))
    }

    private static REQUIRED_INPUT_ERROR = "this value is required"
    /* regex specifying integer values */
    private static NUMBER_REGEX = /[1-9]+[0-9]*/
    private static NUMBER_INPUT_ERROR = "please enter a number"
    /* regex specifying mm/dd/yyyy date format */
    private static DATE_REGEX = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/
    private static DATE_INPUT_ERROR = "please enter a date: mm/dd/yyyy"

    validateFormControl = (formControl: IFormControl, value: FormEntryType): string => {
        if(formControl.required && value === undefined) {
            return Utils.REQUIRED_INPUT_ERROR
        }

        if (formControl.type === "number" && !Utils.NUMBER_REGEX.test(value as string)) {
            return Utils.NUMBER_INPUT_ERROR
        }

        if (formControl.type === "datetime" && !Utils.DATE_REGEX.test(value as string)) {
            return Utils.DATE_INPUT_ERROR
        }
    }

    getQueryStringParameter = (paramToRetrieve: string) => {
        const urlContainsParams = document.URL.includes("?")
        if (urlContainsParams) {
            const params = document.URL.split("?")[1].split("&")
            for (const param of params) {
                const paramComponents = param.split("=")
                const paramName = paramComponents[0]
                const paramVal = paramComponents[1]
                if (paramName === paramToRetrieve) {
                    return decodeURIComponent(paramVal)
                }
            }
            throw new Error(`parameter ${paramToRetrieve} is not present in the current URL`)
        } else {
            throw new Error(`tried to get query string parameter from a URL that does not have query strings`)
        }
    }

    isObjectEmpty = (ob: {}): boolean => {
        for (const key in ob) {
            if (ob.hasOwnProperty(key) && ob[key]) return false
        }
        return true
    }

    getFormattedDate = () => {
        const date = new Date()
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }

    getClientObsMap = (userId: string): ObservableMap<string> => {
        return observable.map([["submitterId", userId]])
    }
}

export const utils = new Utils()
