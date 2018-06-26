export enum EnvType {
    LOCAL = "local",
    SHAREPOINT = "sharepoint",
    SHAREPOINT_PROXY = "sharepointProxy",
    OTHER = "other",
}

declare const NODE_ENV: string

/**
 * associates NODE_ENV string to Environment enum and checks for any uncrecognized
 * NODE_ENV string defaults to local if no NODE_ENV string is supplied by build script
 */
const getEnvironment = (nodeEnv): EnvType => {
    switch (nodeEnv) {
        case "local":
            return EnvType.LOCAL
        case "sharepoint":
            return EnvType.SHAREPOINT
        case "sharepointProxy":
            return EnvType.SHAREPOINT_PROXY
        default:
            return EnvType.OTHER
    }
}

/* make environment constant and publically available */

let _environment: EnvType
// if NODE_ENV is undefined (happens during test execution), an error will be thrown and _environment will get a default value
try {
    _environment = getEnvironment(NODE_ENV)
} catch (exeption) {
    _environment = EnvType.LOCAL
}

export const ENVIRONMENT = _environment
