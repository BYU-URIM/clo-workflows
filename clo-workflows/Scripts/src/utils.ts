export function deepCopy<T>(ob: T): T {
    return JSON.parse(JSON.stringify(ob))
}
