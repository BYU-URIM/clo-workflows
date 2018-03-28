import { IView } from "../View"
import { IRole } from "../Role"
import * as VIEWS from "../../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../../res/json/form_templates/FORM_CONTROLS.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import { Utils } from "../../utils"
import { StepName, IStep } from "../Step"
import { IFormControl } from "../FormControl"


// create model instances by loading raw JSON from res/json and denormalizing it
// all loaders should always use deepCopy(JSON) to create a separate instance so that the global JSON definition is not mutated
const utils = new Utils()
export function getView(viewName: string): IView {
    const normalizedView = VIEWS[viewName]
    if(!normalizedView) throw new Error(`no view for ${viewName} exists`)

    // form controls in a single view are composed of the formControls array and the readonlyFormControls array
    // the readonlyFormControls appear first followed by the standard formControls
    let formControls: IFormControl[] = []

    // first add in the readonly form controls (if present)
    if(normalizedView.readonlyFormControls) {
        formControls = formControls.concat(normalizedView.readonlyFormControls.map(formControlName => {
            const formControl: IFormControl = this.utils.deepCopy(FORM_CONTROLS[formControlName])
            formControl.readonly = true
            return formControl
        }))
    }

    // next add in the standard form controls (if present)
    if(normalizedView.formControls) {
        formControls = formControls.concat(normalizedView.formControls.map(formControlName => this.utils.deepCopy(FORM_CONTROLS[formControlName])))
    }

    return {
        formControls,
        dataSource: normalizedView.dataSource,
    }
}

// although the view JSON definitions are capable of defining a view with readonly and non-readonly form controls,
// this function programatically adds the readonly proprterty to all form controls of a view
// this functionality is for instances when a view needs to be made readonly at runtime or when it is not practical
// to make multiple JSON view definitions differing only by readonly form controls
export function getViewAndMakeReadonly(viewName: string): IView {
    const view = getView(viewName)
    view.formControls.forEach(formControl => formControl.readonly = true)
    return view
}

export function getRole(roleName: string): IRole {
    const normalizedRole = ROLES[roleName]
    return {
        name: normalizedRole.name,
        permittedSteps: normalizedRole.permittedSteps.map(stepName => this.utils.deepCopy(STEPS[stepName])),
        rank: normalizedRole.rank
    }
}

export function getStep(stepName: StepName): IStep {
    return this.utils.deepCopy(STEPS[stepName])
}

export function getStepById(id: number): IStep {
    for(const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        if(step.orderId === id) return this.utils.deepCopy(step)
    }
}

export function getStepForProcessFieldName(processFieldName: string): IStep {
    for(const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        if(step.processFieldNames.includes(processFieldName)) return this.utils.deepCopy(step)
    }
    return null
}

export function getStepNames(): string[] {
    return Object.keys(STEPS)
}

export function getRoleNames(): string[] {
    return Object.keys(ROLES)
}
