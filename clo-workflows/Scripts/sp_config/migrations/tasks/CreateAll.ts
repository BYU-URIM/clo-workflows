import { utils } from "../Util"
import chalk from "chalk"

console.log(chalk`{blue creating lists and fields}`)
const main = async () => {
    utils.validateDBConfig()
    await utils.createAll()
}

main()
