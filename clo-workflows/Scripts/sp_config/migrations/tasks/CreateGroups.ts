import { utils } from "../Util"
import chalk from "chalk"

console.log(chalk`{blue creating Groups}`)
const main = async () => {
    const missingGroups = await utils.getMissingGroups()
    console.log(`${missingGroups.length > 0 ? "missing groups:" + JSON.stringify(missingGroups) : "no groups missing"}`)
    if (missingGroups.length > 0) {
        const res = (await utils.createMissingGroups()) ? "all missing successfully added" : "there was an error"
        console.log(res)
    }
}

main()
