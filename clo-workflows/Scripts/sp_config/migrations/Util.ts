import chalk from "chalk"
import { IPnpNodeSettings, PnpNode } from "sp-pnp-node"
import * as DB_CONFIG from "../../res/json/DB_CONFIG.json"
import { IUtil, IData, IDBConfig, IGroup } from "./IUtil"
import { CloRequestElement } from "../../src/model/"
import { SPRest, sp } from "@pnp/sp"
const db = DB_CONFIG as any
export class Utils implements IUtil {
    pnpNodeSettings: IPnpNodeSettings
    config: any
    constructor() {
        this.config = require("../../config/dev/migrations/private.json")
        this.pnpNodeSettings = {
            siteUrl: `${this.config.siteUrl}`,
            authOptions: this.config,
        }
        sp.setup({
            sp: {
                fetchClientFactory: () => {
                    return new PnpNode(this.pnpNodeSettings)
                },
                baseUrl: `${this.config.siteUrl}`,
            },
        }),
            (this.data = {
                proposedLists: Object.keys(db.tables),
                currentListTitles: Array<string>(),
                missingLists: Array<string>(),
            })
    }
    data: IData
    sp: SPRest = sp
    /* -------------------------------------------------- *
     * ----------             LISTS            ---------- *
     * -------------------------------------------------- */
    async getAllCurrentListTitles() {
        const res = await sp.web.lists.select("Title").get()
        return res.map(listinfo => listinfo.Title)
    }
    async getCurrentListTitles() {
        const res = await sp.web.lists.select("Title").get()
        const titles = await res.map(listinfo => listinfo.Title)
        return titles.filter(list => !db.defaultTables.includes(list))
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
            await sp.web.lists.getByTitle(title).delete()
            console.log(chalk`{red deleted}: {blue ${title}}`)
        }
        console.log(chalk`{red deleted}: {blue ${len.toString()}} lists`)
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
    async ensureSiteAssetsLibrary() {
        return sp.web.lists.ensureSiteAssetsLibrary().catch(console.log)
    }
    async ensureList(title: string) {
        await sp.web.lists.ensure(title, `${title} description`, 100, true)
        for (const field of db.tables[title].fields) {
            !db.defaultFields.includes(field)
                ? (await sp.web.lists.getByTitle(title).fields.addText(field), console.log(chalk`{green created field}: {blue ${field}} `))
                : console.log(chalk`{green field already exists}: {blue ${field}} `)
        }
    }
    async updateListFields(listTitle: string) {
        const fields = await this.sp.web.lists.getByTitle(listTitle).fields.get()
        return fields.map(field => field.Title)
    }

    validateDBConfig() {
        const tables = db.tables
        Object.values(tables).forEach(element => {
            // console.log(utils.validateStringArray(element.fields))
        })
    }
    fieldIsValid(field: string) {
        const allowedChars = /^[0-9a-zA-Z]+$/

        const hasBadChars = !field.match(allowedChars)
        const hasTooManyChars = field.length > 32
        if (hasBadChars || hasTooManyChars) {
            console.log(chalk`{red
____________________________________________________________________________________________
ERROR: INVALID  FIELD
}{yellow info: please make sure your table fields are:
    - less or equal to than 32 characters
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

    /* -------------------------------------------------- *
     * ----------            Groups            ---------- *
     * -------------------------------------------------- */
    async getAllGroups(): Promise<Array<CloRequestElement>> {
        return sp.web.siteGroups.get()
    }
    async getAllGroupTitles(): Promise<Array<string>> {
        const groups = await sp.web.siteGroups.get()
        return groups.map(group => group.Title)
    }
    async getMissingGroups(): Promise<Array<IGroup>> {
        const allGroupTitles = await this.getAllGroupTitles()
        return db.groups.filter(group => !allGroupTitles.includes(group.name))
    }
    async createGroup(groupName: string) {
        await sp.web.siteGroups.add({
            Title: groupName,
        })
    }
    async createGroups(groups: Array<IGroup>): Promise<void> {
        groups.forEach(group => this.createGroup(group.name))
    }
    async addUsersToGroups(groups: Array<IGroup>) {
        groups.forEach(group => {
            if (group.members.length > 0) group.members.forEach(member => sp.web.siteGroups.getByName(group.name).users.add(member))
        })
    }
    async createMissingGroups(): Promise<void> {
        const missingGroups = await this.getMissingGroups()
        const groups = await this.createGroups(missingGroups)
        await this.addUsersToGroups(missingGroups)
        return groups
    }
}

export const utils = new Utils()
