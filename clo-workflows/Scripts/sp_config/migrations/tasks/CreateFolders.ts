import { utils } from "../Util"
import chalk from "chalk"

const main = async () => {
    const folders = await utils.createFolder()
    console.log(folders)

}

main()

