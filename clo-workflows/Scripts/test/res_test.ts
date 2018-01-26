import * as ava from "ava"
import * as ROLES from "../res/json/processing_config/USER_ROLES.json"
import * as STEPS from "../res/json/processing_config/PROCESS_STEPS.json"
import * as VIEWS from "../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../res/json/form_templates/FORM_CONTROLS.json"
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
    for(const roleName in ROLES) {
        const role: {name: string, permittedSteps: string[]} = ROLES[roleName]
        t.truthy(role.name)
        t.truthy(role.permittedSteps)
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
    for(const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        t.truthy(step.name)
        t.regex(String(step.stepId), /[0-9]+/)
        t.not(step.view, undefined)
        if(step.view) {
            t.truthy(VIEWS[step.view]) // ensure that the view string in the step is a valid reference to a view object in VIEWS.json
        }
    }
})

/*
    ensure all JSON formControls have the correct shape:
    {
        displayName: string
        modelRef: string
        type: FormControlType
        choices?: Array<string>
    }
*/
ava.test("test form controls for correct shape", t => {
    const formControlTypes = ["text", "choice", "checkbox", "textarea", "datetime", "number"]

    for(const formControlName in FORM_CONTROLS) {
        const formControl: IFormControl= FORM_CONTROLS[formControlName]
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
    ensure that all views contain references to exisiting form controls
*/
ava.test("test that all views contain only valid formControl names", t => {
    for(const viewName in VIEWS) {
        const formControlNames: string[] = VIEWS[viewName]
        formControlNames.forEach(formControlName => {
            t.truthy(FORM_CONTROLS[formControlName])
        })
    }
})
