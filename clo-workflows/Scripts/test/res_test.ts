import * as ava from "ava"
import * as roles from "../res/json/USER_ROLES.json"
import * as steps from "../res/json/PROCESS_STEPS.json"
import * as PROCESS_FORM_CONTROLS from "../res/json/PROCESS_FORM_CONTROLS.json"
import * as WORK_FORM_CONTROLS from "../res/json/WORK_FORM_CONTROLS.json"
import * as PROJECT_FORM_CONTROLS from "../res/json/PROJECT_FORM_CONTROLS.json"
import * as WORK_TYPES from "../res/json/WORK_TYPES.json"
import * as PROJECT_TYPES from "../res/json/PROJECT_TYPES.json"
import { IFormControl } from "../src/model/FormControl"

/*
    ensure all JSON roles have the correct shape:
    {
        name: string
        permittedSteps: Array<string> // strings must be keys in the steps JSON
    }
*/
ava.test("test json roles for correct shape", t => {
    for(const roleName in roles) {
        const role: {name: string, permittedSteps: string[]} = roles[roleName]
        t.truthy(role.name)
        t.truthy(role.permittedSteps)
        role.permittedSteps.forEach(stepName => {
            t.truthy(steps[stepName]) // stepName string in permittedSteps array must refer to a step object
        })
    }
})

/*
    ensure all JSON steps have the correct shape:
    {
        name: string
        processFormControls: Array<string> // strings must be keys in the processFormControls JSON
    }
*/
ava.test("test json steps for correct shape", t => {
    for(const stepName in steps) {
        const step: {name: string, processFormControls: string[]} = steps[stepName]
        t.truthy(step.name)
        t.truthy(step.processFormControls)
        step.processFormControls.forEach(formControlName => {
            t.truthy(PROCESS_FORM_CONTROLS[formControlName]) // formControl string in permittedSteps array must refer to a formControl object
        })
    }
})

/*
    ensure all JSON processFormControls have the correct shape:
    {
        displayName: string
        modelRef: string
        type: FormControlType
        choices?: Array<string>
    }
*/
ava.test("test processFormControls for correct shape", t => {
    const formControlTypes = ["text", "choice", "checkbox", "textarea", "datetime", "number"]

    for(const formControlName in PROCESS_FORM_CONTROLS) {
        const formControl: IFormControl= PROCESS_FORM_CONTROLS[formControlName]
        t.truthy(formControl.displayName)
        t.truthy(formControl.dataRef)
        t.truthy(formControl.type)
        t.true(formControlTypes.indexOf(formControl.type) !== -1)
        if(formControl.type === "choice") {
            t.truthy(formControl.choices)
        }
    }
})

/*
    ensure all JSON WorkFormContols have the correct shape:
    {
        displayName: string
        modelRef: string
        type: FormControlType
        choices?: Array<string>
    }
*/
ava.test("test workFormControls for correct shape", t => {
    const formControlTypes = ["text", "choice", "checkbox", "textarea", "datetime", "number"]

    for(const formControlName in WORK_FORM_CONTROLS) {
        const formControl: IFormControl= WORK_FORM_CONTROLS[formControlName]
        t.truthy(formControl.displayName)
        t.truthy(formControl.dataRef)
        t.truthy(formControl.type)
        t.true(formControlTypes.indexOf(formControl.type) !== -1)
        if(formControl.type === "choice") {
            t.truthy(formControl.choices)
        }
    }
})

/*
    ensure all JSON ProjectFormControls have the correct shape:
    {
        displayName: string
        modelRef: string
        type: FormControlType
        choices?: Array<string>
    }
*/
ava.test("test projectFormControls for correct shape", t => {
    const formControlTypes = ["text", "choice", "checkbox", "textarea", "datetime", "number"]

    for(const formControlName in PROJECT_FORM_CONTROLS) {
        const formControl: IFormControl= PROJECT_FORM_CONTROLS[formControlName]
        t.truthy(formControl.displayName)
        t.truthy(formControl.dataRef)
        t.truthy(formControl.type)
        t.true(formControlTypes.indexOf(formControl.type) !== -1)
        if(formControl.type === "choice") {
            t.truthy(formControl.choices)
        }
    }
})

/*
    ensure that all projectTypes contain references to exisiting form controls
*/
ava.test("test that project types contain only valid projectFormControl names", t => {
    for(const projectType in PROJECT_TYPES) {
        const formControlNames: string[] = PROJECT_TYPES[projectType]
        formControlNames.forEach(formControlName => {
            t.truthy(PROJECT_FORM_CONTROLS[formControlName])
        })
    }
})

/*
    ensure that all workTypes contain references to exisiting form controls
*/
ava.test("test that work types contain only valid workFormControl names", t => {
    for(const workType in WORK_TYPES) {
        const formControlNames: string[] = WORK_TYPES[workType]
        formControlNames.forEach(formControlName => {
            t.truthy(WORK_FORM_CONTROLS[formControlName])
        })
    }
})
