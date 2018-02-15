import { utils } from "../Util"
import chalk from "chalk"

console.log(chalk`{blue creating lists and fields}`)
const CreateAll = async () => utils.validateDBConfig()
CreateAll().then(u =>{
    utils.createAll()
})
