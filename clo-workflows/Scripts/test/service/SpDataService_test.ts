import { CloRequestElementParser } from "../../src/service/dataService/SpDataService"
import * as DB_CONFIG from "../../res/json/DB_CONFIG.json"

test("clo data parser - ensure that the fieldSet contains every field from every table in addition to default fields", () => {
    const cloParser = new CloRequestElementParser()
    const fieldSet: Set<string> = cloParser["cloFieldSet"] // bracket notation used to access a private member (bypasses type system)

    // test each table.fields list to ensure each field is present in the field set
    Object.keys(DB_CONFIG["tables"]).forEach(tableName => {
        const table = DB_CONFIG["tables"][tableName]
        table.fields.forEach(fieldName => expect(fieldSet.has(fieldName)).toBe(true))
    })

    // test the default fields list to make sure each default field is present in the field set
    DB_CONFIG["defaultFields"].forEach(fieldName => expect(fieldSet.has(fieldName)).toBe(true))
})

test("clo data parser - ensure that the parser correctly parses and filters a sample SharePoint response object", async () => {
    const cloParser = new CloRequestElementParser()

    // an example response from the SP server - contains a mix of clo fields and SP metadata fields
    const spResponseJSON = {
        // SP metadata fields
        AttachmentFiles: { __deferred: { uri: "https://someurl.com" } },
        ContentTypeId: "0x0100A4667454EAE2A949908005FBAF889993",
        FileSystemObjectType: 0,
        Folder: { __deferred: { uri: "https://someurl.com" } },
        OData__UIVersionString: "1.0",

        // clo fields
        Title: "my CLO request",
        Id: 5,
        step: "Existing License",
    }

    // expected response containing only clo fields
    const expectedFilteredResponse = {
        Title: "my CLO request",
        Id: 5,
        step: "Existing License",
    }

    const actualFilteredResponse = cloParser["filterSpResponseObject"](spResponseJSON)
    expect(actualFilteredResponse).toStrictEqual(expectedFilteredResponse)
})
