export enum Environment {
    LOCAL = 'local',
    SHAREPOINT = 'sharepoint',
    OTHER = 'other',
}

// gloabal variable set at build time through build script
// passed in through webpack plugin
declare const NODE_ENV: string

// associates NODE_ENV string to Environment enum and checks for any uncrecognized NODE_ENV string
// defaults to local if no NODE_ENV string is supplied by build script
function getEnvironment(nodeEnv: string = 'local'): Environment {
    switch(nodeEnv) {
    case 'local':
        return Environment.LOCAL
    case 'sharepoint':
        return Environment.SHAREPOINT
    default:
        return Environment.OTHER
    }
}

// make environment constant and publically available
export const ENVIRONMENT: Environment = getEnvironment(NODE_ENV)
