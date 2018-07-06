import { DB_CONFIG, FORM_CONTROLS, ROLES, STEPS, VIEWS } from "../res/"
import { IFormControl, IStep, PROJECT_TYPES, WORK_TYPES, FormControl, View, StepName } from "../src/model"

/*
    ensure all JSON roles have the correct shape:
    {
        name: string
        permittedSteps: Array<string> // strings must be keys in the steps JSON
        rank: number
    }
*/
test("test json roles for correct shape", () => {
    for (const roleName in ROLES) {
        const role: { name: string; permittedSteps: string[]; rank: number } = ROLES[roleName]
        expect(typeof role.name).toBe("string")
        expect(typeof role.rank).toBe("number")
        expect(Array.isArray(role.permittedSteps)).toBe(true)
        role.permittedSteps.forEach(stepName => {
            expect(STEPS[stepName]).toBeTruthy() // stepName string in permittedSteps array must refer to a step object
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
test("test json steps for correct shape", () => {
    const processFieldNames: string[] = DB_CONFIG["tables"].processes.fields

    for (const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        expect(typeof step.name).toBe("string")
        expect(step.orderId).not.toBeUndefined()
        expect(step.view).not.toBeUndefined()
        if (step.view) {
            const jsonView = new View(VIEWS[step.view])
            expect(jsonView).toBeTruthy()

            // ensure that the view accurately displays the given step according to the rules above
            // first check the viewformFields against the step processformFields (they should contain the same field names)
            expect(step.processFieldNames.length).toStrictEqual(jsonView.formFields.length)
            for (const _formControl of jsonView.formFields) {
                const formControl: IFormControl = FORM_CONTROLS[_formControl.displayName]
                expect(step.processFieldNames.includes(_formControl.dataRef))
            }

            // then check privilegedFormFields against all previous step processformFields
            const previousStepsProcessFieldNames: string[] = Object.keys(STEPS)
                .map(curStepName => STEPS[curStepName])
                .filter(stepJson => stepJson.orderId < step.orderId) // only keep steps with a lower orderID
                .reduce((accumulator, prevStepJson) => {
                    return accumulator.concat(prevStepJson.formFields)
                }, [])
            // expect(previousStepsProcessFieldNames.length).toStrictEqual(jsonView.formFields.length)
            for (const _formControl of jsonView.readOnlyFormFields) {
                expect(previousStepsProcessFieldNames.includes(_formControl.dataRef))
            }
        }

        expect(processFieldNames).toContain(step.submitterFieldName)
        expect(processFieldNames).toContain(step.submissionDateFieldName)
    }
})

/*
    ensure all JSON formFields have the correct shape:
    {
        displayName: string
        dataRef: string
        type: FormControlType
        choices?: Array<string>
    }
*/
test("test form controls for correct shape", () => {
    for (const formControlName in FORM_CONTROLS) {
        const formControl: FormControl = new FormControl(FORM_CONTROLS[formControlName])
        expect(formControl).toBeInstanceOf(FormControl)
    }
})

/*
    ensure that all views contain references to exisiting form controls and have correct shape
    {
        dataSource: string
        privilegedFormFields: Array<IFormControl>
        formFields: Array<IFormControl>
    }
*/
test("test that all views contain only valid formControl names and have correct shape", () => {
    for (const viewName in VIEWS) {
        const view = VIEWS[viewName]
        expect(typeof view.dataSource === "string")

        if (view.formFields) {
            expect(Array.isArray(view.formFields))
            const formControlNames: string[] = view.formFields
            formControlNames.forEach(formControlName => {
                expect(FORM_CONTROLS[formControlName]).toBeTruthy()
            })
        }

        if (view.privilegedFormFields) {
            expect(Array.isArray(view.privilegedFormFields))
            const formControlNames: string[] = view.privilegedFormFields
            formControlNames.forEach(formControlName => {
                expect(FORM_CONTROLS[formControlName]).toBeTruthy()
            })
        }

        if (view.privilegedControls) {
            expect(Array.isArray(view.privilegedControls))
            const formControlNames: string[] = view.privilegedControls
            formControlNames.forEach(formControlName => {
                expect(FORM_CONTROLS[formControlName]).toBeTruthy()
            })
        }

        // if the view is a process view, it must have form controls and privilegedFormFields
        if (view.dataSource === "processes") {
            expect(view.formFields).toBeTruthy()
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
test("test that DB_CONFIG.json has the correct structure", () => {
    expect(typeof DB_CONFIG["hostUrl"]).toBe("string")
    expect(typeof DB_CONFIG["tables"]).toBe("object")

    Object.keys(DB_CONFIG["tables"]).forEach((tableName: string) => {
        const table = DB_CONFIG["tables"][tableName]
        expect(table.type).toBe("list" || "library")
        expect(Array.isArray(table.fields)).toBe(true)

        // make sure each field conforms to rules
        table.fields.forEach(fieldName => {
            expect(fieldName.length).toBeGreaterThan(0)
            expect(fieldName.length).toBeLessThanOrEqual(32)
        })
    })
})

/*
    ensure that each form control dataRef references a valid field from the database schema (DB_CONFIG)
    a reference has two pieces:
        first, each view has a data source which refers to a table in the database schema
        second, each form control of that view has a data ref which must refer to a field from the view's data source (table)
*/
test("ensure that each form control dataRef references a valid field from the correct database schema", () => {
    for (const viewName in VIEWS) {
        const view = VIEWS[viewName]
        const table = DB_CONFIG["tables"][view.dataSource]

        for (const formControlName of view.formFields) {
            const formControl = FORM_CONTROLS[formControlName]
            expect(table.fields.includes(formControl.dataRef))
        }
    }
})

/*
    ensure that the work type and project type arrays in model/CloRequestElement line up with view names
*/
test("ensure that the work type and project type arrays refer to valid view names", () => {
    const jsonViewNames = Object.keys(VIEWS)

    for (const workName of WORK_TYPES) {
        expect(jsonViewNames.includes(workName))
    }

    for (const projectName of PROJECT_TYPES) {
        expect(jsonViewNames.includes(projectName))
    }
})
