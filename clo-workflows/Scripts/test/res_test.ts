import * as ava from "ava"
import * as ROLES from "../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../res/json/processing_config/PROCESS_STEPS.json"
import * as VIEWS from "../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../res/json/form_templates/FORM_CONTROLS.json"
import * as DB_CONFIG from "../res/json/DB_CONFIG.json"
import { IFormControl } from "../src/model/FormControl"
import { IStep } from "../src/model/Step"
import { PROJECT_TYPES, WORK_TYPES } from "../src/model/CloRequestElement"

/*
    ensure all JSON roles have the correct shape:
    {
        name: string
        permittedSteps: Array<string> // strings must be keys in the steps JSON
        rank: number
    }
*/
ava.test("test json roles for correct shape", t => {
    for (const roleName in ROLES) {
        const role: { name: string; permittedSteps: string[], rank: number } = ROLES[roleName]
        t.true(typeof role.name === "string")
        t.true(Number.isInteger(role.rank))
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
        orderId: number
        view: string // string referring to a view defined in VIEWS.json
        submitterFieldName: string
        submitterDateFieldName: string
        processFieldNames: string[]
    }
    - ensure that the submitterIdFieldName and submitterDateFieldName refer to valid field names in the databse schema for the process table
    as defined in res/DB_CONFIG
    - ensure that view accurately displays the step according to the following rules:
        - the view for a given step must display editable (normal) form controls for the processFieldNames for that step
        - the view for a step must display readonly form controls for all of the processFieldNames corresponding to previous steps
        - the view should display any form controls for processFieldNames corresponding to future steps
*/
ava.test("test json steps for correct shape", t => {
    const processFieldNames: string[] = DB_CONFIG["tables"].processes.fields

    for (const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        t.true(typeof step.name === "string")
        t.regex(String(step.orderId), /[0-9]+/)
        t.not(step.view, undefined)
        if (step.view) {
            const jsonView = VIEWS[step.view]
            t.truthy(jsonView) // ensure that the view string in the step is a valid reference to a view object in VIEWS.json

            // ensure that the view accurately displays the given step according to the rules above
            // first check the viewFormControls against the step processFormControls (they should contain the same field names)
            t.deepEqual(step.processFieldNames.length, jsonView.formControls.length)
            for(const formControlName of jsonView.formControls) {
                const formControl: IFormControl = FORM_CONTROLS[formControlName]
                t.true(step.processFieldNames.includes(formControl.dataRef))
            }

            // then check readonlyFormControls against all previous step processFormControls
            const previousStepsProcessFieldNames: string[] = Object.keys(STEPS)
                .map(curStepName => STEPS[curStepName])
                .filter(stepJson => stepJson.orderId < step.orderId) // only keep steps with a lower orderID
                .reduce((accumulator, prevStepJson) => {
                    return accumulator.concat(prevStepJson.processFieldNames)
                }, [])
            t.deepEqual(previousStepsProcessFieldNames.length, jsonView.readonlyFormControls.length)
            for(const formControlName of jsonView.readonlyFormControls) {
                const formControl: IFormControl = FORM_CONTROLS[formControlName]
                t.true(previousStepsProcessFieldNames.includes(formControl.dataRef))
            }
        }

        t.true(processFieldNames.includes(step.submitterIdFieldName))
        t.true(processFieldNames.includes(step.submissionDateFieldName))
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
        readonlyFormControls: Array<IFormControl>
        formControls: Array<IFormControl>
    }
*/
ava.test("test that all views contain only valid formControl names and have correct shape", t => {
    for (const viewName in VIEWS) {
        const view = VIEWS[viewName]
        t.true(typeof view.dataSource === "string")

        if(view.formControls) {
            t.true(Array.isArray(view.formControls))
            const formControlNames: string[] = view.formControls
            formControlNames.forEach(formControlName => {
                t.truthy(FORM_CONTROLS[formControlName])
            })
        }

        if(view.readonlyFormControls) {
            t.true(Array.isArray(view.readonlyFormControls))
            const formControlNames: string[] = view.readonlyFormControls
            formControlNames.forEach(formControlName => {
                t.truthy(FORM_CONTROLS[formControlName])
            })
        }

        // if the view is a process view, it must have form controls and readonlyFormControls
        if(view.dataSource === "processes") {
            t.truthy(view.formControls && view.readonlyFormControls)
        }
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

/*
    ensure that the work type and project type arrays in model/CloRequestElement line up with view names
*/
ava.test("ensure that the work type and project type arrays refer to valid view names", t => {
    const jsonViewNames = Object.keys(VIEWS)

    for(const workName of WORK_TYPES) {
        t.true(jsonViewNames.includes(workName))
    }

    for(const projectName of PROJECT_TYPES) {
        t.true(jsonViewNames.includes(projectName))
    }
})
