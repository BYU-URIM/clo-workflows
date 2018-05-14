class Utils {
    deepCopy = <T>(ob: T): T => ob

    getQueryStringParameter = (paramToRetrieve: string) => {
        const params = document.URL.includes("?") ? document.URL.split("?")[1].split("&") : undefined
        if (params) {
            for (const _param of params) {
                const param = {
                    name: _param.split("=")[0],
                    val: _param.split("=")[1],
                }
                if (param.name === paramToRetrieve) return decodeURIComponent(param.val)
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
