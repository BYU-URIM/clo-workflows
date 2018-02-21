import * as ava from "ava"
import * as ROLES from "../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../res/json/processing_config/PROCESS_STEPS.json"
import * as VIEWS from "../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../res/json/form_templates/FORM_CONTROLS.json"
import * as DB_CONFIG from "../res/json/DB_CONFIG.json"
import { IFormControl } from "../src/model/FormControl"
import { IStep } from "../src/model/Step"

/*
    ensure all JSON roles have the correct shape:
    {
        name: string
        permittedSteps: Array<string> // strings must be keys in the steps JSON
    }
*/
ava.test("test json roles for correct shape", t => {
    for (const roleName in ROLES) {
        const role: { name: string; permittedSteps: string[] } = ROLES[roleName]
        t.true(typeof role.name === "string")
        t.true(Array.isArray(role.permittedSteps))
        role.permittedSteps.forEach(stepName => {
            t.truthy(STEPS[stepName]) // stepName string in permittedSteps array must refer to a step object
        })
    }
})

/*
    ensure all JSON steps have the correct shape:
    {
        name: string
        stepId: number
        view: string // string referring to a view defined in VIEWS.json
    }
*/
ava.test("test json steps for correct shape", t => {
  for (const stepName in STEPS) {
    const step: IStep = STEPS[stepName]
    t.true(typeof step.name === "string")
    t.regex(String(step.stepId), /[0-9]+/)
    t.not(step.view, undefined)
    if (step.view) {
      t.truthy(VIEWS[step.view]) // ensure that the view string in the step is a valid reference to a view object in VIEWS.json
    }
  }
})

/*
    ensure all JSON formControls have the correct shape:
    {
        displayName: string
        dataRef: string
        type: FormControlType
        choices?: Array<string>
    }
*/
ava.test("test form controls for correct shape", t => {
    const formControlTypes = ["text", "choice", "checkbox", "textarea", "datetime", "number"]

    for (const formControlName in FORM_CONTROLS) {
        const formControl: IFormControl = FORM_CONTROLS[formControlName]
        t.true(typeof formControl.displayName === "string")
        t.true(typeof formControl.dataRef === "string")
        t.true(formControlTypes.includes(formControl.type))
        if (formControl.type === "choice") {
            t.true(Array.isArray(formControl.choices))
        }
    }
})

/*
    ensure that all views contain references to exisiting form controls and have correct shape
    {
        dataSource: string
        formControls: Array<IFormControl>
    }
*/
ava.test("test that all views contain only valid formControl names and have correct shape", t => {
    for (const viewName in VIEWS) {
        const view = VIEWS[viewName]
        t.true(typeof view.dataSource === "string")
        t.true(Array.isArray(view.formControls))

        const formControlNames: string[] = view.formControls
        formControlNames.forEach(formControlName => {
            t.truthy(FORM_CONTROLS[formControlName])
        })
    }
})

/*
    ensure that the DB_CONFIG has the correct structure
    {
        hostUrl: string
        tables: {
            listName: {
                type: string ("list" | "library")
                fields: Array<string>
            }
        }
    }
    
    // NOTE field names must be less than characters long and contain only capital and lowercase letters / numbers
*/
ava.test("test that DB_CONFIG.json has the correct structure", t => {
    t.true(typeof DB_CONFIG["hostUrl"] === "string")
    t.true(typeof DB_CONFIG["tables"] === "object")

    Object.keys(DB_CONFIG["tables"]).forEach((tableName: string) => {
        const table = DB_CONFIG["tables"][tableName]
        t.true(table.type === "list" || table.type === "library")
        t.true(Array.isArray(table.fields))
    
        // make sure each field conforms to rules
        table.fields.forEach(fieldName => {
            t.regex(fieldName, /^([A-Za-z | 0-9]){1,32}$/, `${fieldName} should be < 32 characters long and only contain letters or numbers`)
        })
    })
})

/*
    ensure that each form control dataRef references a valid field from the database schema (DB_CONFIG)
    a reference has two pieces:
        first, each view has a data source which refers to a table in the database schema
        second, each form control of that view has a data ref which must refer to a field from the view's data source (table)
*/
ava.test("ensure that each form control dataRef references a valid field from the correct database schema", t => {
    for (const viewName in VIEWS) {
        const view = VIEWS[viewName]
        const table = DB_CONFIG["tables"][view.dataSource]

        for (const formControlName of view.formControls) {
            const formControl = FORM_CONTROLS[formControlName]
            t.true(table.fields.includes(formControl.dataRef))
        }
    }
})
