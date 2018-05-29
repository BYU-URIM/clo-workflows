import { utils } from "../Util"

const main = async () => {
    const titles = await utils.updateListFields("works")
    console.log(titles.filter(title => utils))
}
main()
