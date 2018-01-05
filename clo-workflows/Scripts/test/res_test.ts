import * as ava from "ava"
import * as roles from "../res/json/Roles.json"
import * as steps from "../res/json/Steps.json"
import * as processFormControls from "../res/json/ProcessFormControls.json"
import * as workFormControls from "../res/json/WorkFormControls.json"
import * as projectFormControls from "../res/json/ProjectFormControls.json"
import * as workTypes from "../res/json/WorkTypes.json"
import * as projectTypes from "../res/json/ProjectTypes.json"
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
            t.truthy(processFormControls[formControlName]) // formControl string in permittedSteps array must refer to a formControl object
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

    for(const formControlName in processFormControls) {
        const formControl: IFormControl= processFormControls[formControlName]
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

    for(const formControlName in workFormControls) {
        const formControl: IFormControl= workFormControls[formControlName]
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

    for(const formControlName in projectFormControls) {
        const formControl: IFormControl= projectFormControls[formControlName]
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
    for(const projectType in projectTypes) {
        const formControlNames: string[] = projectTypes[projectType]
        formControlNames.forEach(formControlName => {
            t.truthy(projectFormControls[formControlName])
        })
    }
})

/*
    ensure that all workTypes contain references to exisiting form controls
*/
ava.test("test that work types contain only valid workFormControl names", t => {
    for(const workType in workTypes) {
        const formControlNames: string[] = workTypes[workType]
        formControlNames.forEach(formControlName => {
            t.truthy(workFormControls[formControlName])
        })
    }
})
