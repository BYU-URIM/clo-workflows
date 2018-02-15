import chalk from "chalk"
import * as pnp from "sp-pnp-js"
import { IPnpNodeSettings, PnpNode } from "sp-pnp-node"

import * as db from "../../res/json/DB_CONFIG.json"
import { IUtil, IData, IDBConfig } from "./IUtil"
import { SPRest } from "sp-pnp-js/lib/sharepoint/rest"

const DB_CONFIG = db as any

export class Utils implements IUtil {
    pnpNodeSettings: IPnpNodeSettings
    config: any
    constructor(dbConfig: any) {
        this.config = require("./private.json")
        this.pnpNodeSettings = {
            siteUrl: `${this.config.siteUrl}`,
            authOptions: this.config,
        }
        pnp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new PnpNode(this.pnpNodeSettings)
                },
                baseUrl: `${this.config.siteUrl}`,
            },
        }),
            (this.DB_CONFIG = dbConfig),
            (this.data = {
                proposedLists: Object.keys(this.DB_CONFIG.tables),
                currentListTitles: Array<string>(),
                missingLists: Array<string>(),
            })
        this.sp = pnp.sp
    }
    DB_CONFIG: IDBConfig
    data: IData
    sp: SPRest
    /*****************************************************
     * LISTS
     *****************************************************/
    async getAllCurrentListTitles() {
        const res = await pnp.sp.web.lists.select("Title").get()
        return await res.map(listinfo => listinfo.Title)
    }
    async getCurrentListTitles() {
        const res = await pnp.sp.web.lists.select("Title").get()
        const titles = await res.map(listinfo => listinfo.Title)
        return titles.filter(list => !this.DB_CONFIG.defaultTables.includes(list))
    }
    async getMissingListTitles() {
        const res = await this.getCurrentListTitles()
        return res.filter(e => this.data.proposedLists.includes(e))
    }
    async getMissing() {
        await this.getMissingListTitles()
        return this.data.missingLists
    }
    async deleteAll() {
        const nonDefaultListTitles = await this.getCurrentListTitles()
        const len = nonDefaultListTitles.length
        for (const title of nonDefaultListTitles) {
            await pnp.sp.web.lists.getByTitle(title).delete()
            console.log(chalk`{red deleted}: {blue ${title}}`)
        }
        console.log(chalk`{red deleted}: {blue ${len}} lists`)
    }
    async createAll() {
        const currentListTitles = await this.getCurrentListTitles()
        const missingListTitles = this.data.proposedLists.filter(list => {
            return !currentListTitles.includes(list)
        })
        for (const listTitle of missingListTitles) {
            console.log(`   ${listTitle}
-----------------`)
            console.log(chalk`{green created list}: {blue ${listTitle}} `)
            await this.ensureList(listTitle)
        }
    }

    async ensureList(title: string) {
        const x = pnp.sp.web.lists.ensure(title, `${title} description`, 100, true)
        const y = x.then(async () => {
            const allfields = this.DB_CONFIG.tables[title].fields
            for (const field of allfields) {
                await pnp.sp.web.lists.getByTitle(title).fields.addText(field)
                console.log(chalk`{green created field}: {blue ${field}} `)
            }
        })
    }
    async addChanged() {
        const current = await this.getCurrentListTitles()
    }

    validateDBConfig() {
        const tables = this.DB_CONFIG.tables
        const x = (Object as any).values(tables).forEach(element => {
            console.log(utils.validateStringArray(element.fields))
        })
    }
    fieldIsValid(field: string) {
        const allowedChars = /^[0-9a-zA-Z]+$/

        const hasBadChars = !field.match(allowedChars)
        const hasTooManyChars = field.length >= 32
        if (hasBadChars || hasTooManyChars) {
            console.log(chalk`{red
____________________________________________________________________________________________                
ERROR: INVALID  FIELD
}{yellow info: please make sure your table fields are:
    - less than 32 characters 
    - contain alphanumeric characters only}
    
{cyan failed on field with value ' {white.underline.bgRed  ${field} } '} 
{red ____________________________________________________________________________________________}`)
            process.exit()
        }
        return hasBadChars ? false : hasTooManyChars ? false : true
    }
    validateFieldVerbose(stringToValidate: string) {
        if (this.fieldIsValid(stringToValidate).toString()) {
            console.log(chalk`{blue        value: {cyan ${stringToValidate}}
     passing: ${this.fieldIsValid(stringToValidate) ? chalk.redBright("true") : chalk.red("false")}}`)
        }
        return this.fieldIsValid(stringToValidate)
    }
    validateStringArrayVerbose(testWords: Array<string>) {
        const result = testWords.filter(word => !this.validateFieldVerbose(word)).join("\n\t")
        return result
    }
    validateField(stringToValidate: string) {
        return this.fieldIsValid(stringToValidate)
    }
    validateStringArray(testWords: Array<string>) {
        const result = testWords.filter(word => !this.validateField(word)).join("\n\t")
        return result
    }
}

const u = (): Utils => new Utils(db)
export const utils = u()
