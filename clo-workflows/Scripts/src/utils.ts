import { ObservableMap } from "mobx/lib/types/observablemap"
import { observable } from "mobx"

class Utils {
    deepCopy = <T>(ob: T): T => {
        return JSON.parse(JSON.stringify(ob))
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
}

export default new Utils()
