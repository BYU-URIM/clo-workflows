import { Role, View, FormControl, StepName, Step, IStep } from ".."
import * as VIEWS from "../../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../../res/json/form_templates/FORM_CONTROLS.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import Utils from "../../utils"

// create model instances by loading raw JSON from res/json and denormalizing it
// all loaders should always use deepCopy(JSON) to create a separate instance so that the global JSON definition is not mutated
export function getView(viewName: string, privileged: boolean = false): View {
    const normalizedView = VIEWS[viewName]
    if (!normalizedView) throw new Error(`no view for ${viewName} exists`)

    // form controls in a single view are composed of the formControls array and the readonlyFormControls array
    // the readonlyFormControls appear first followed by the standard formControls
    let formControls: FormControl[] = []
    if (privileged && normalizedView.privilegedControls.length) {
        formControls = formControls.concat(
            normalizedView.privilegedControls.map(formControlName => {
                const formControl = new FormControl(FORM_CONTROLS[formControlName])
                return formControl
            })
        )
    }
    // first add in the readonly form controls (if present)
    if (normalizedView.readonlyFormControls) {
        formControls = formControls.concat(
            normalizedView.readonlyFormControls.map(formControlName => {
                const formControl = new FormControl(FORM_CONTROLS[formControlName])
                formControl.makeReadOnly()
                return formControl
            })
        )
    }

    // next add in the standard form controls (if present)
    if (normalizedView.formControls) {
        formControls = formControls.concat(
            normalizedView.formControls.map(formControlName => {
                return new FormControl(FORM_CONTROLS[formControlName])
            })
        )
    }

    return new View({
        formControls,
        dataSource: normalizedView.dataSource,
    })
}

// although the view JSON definitions are capable of defining a view with readonly and non-readonly form controls,
// this function programatically adds the readonly proprterty to all form controls of a view
// this functionality is for instances when a view needs to be made readonly at runtime or when it is not practical
// to make multiple JSON view definitions differing only by readonly form controls
export function getViewAndMakeReadonly(viewName: string, priveleged: boolean = true): View {
    /* priveleged defaults to true because we only use it with employees currently */
    const view = getView(viewName, priveleged)
    view.formControls.forEach(formControl => formControl.makeReadOnly())
    return view
}

export function getRole(roleName: string): Role {
    const normalizedRole = ROLES[roleName] || getRole("LTT Client")
    return new Role({
        name: normalizedRole.name,
        permittedSteps: normalizedRole.permittedSteps.map(stepName => Utils.deepCopy(STEPS[stepName])),
        rank: normalizedRole.rank,
    })
}

export function getStep(stepName: StepName): Step {
    return new Step(STEPS[stepName])
}

export function getStepById(id: number): Step {
    for (const stepName in STEPS) {
        if (STEPS[stepName].orderId === id) return new Step(STEPS[stepName])
    }
}

export function getStepForProcessFieldName(processFieldName: string): Step {
    for (const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        if (step.processFieldNames.includes(processFieldName)) return new Step(step)
    }
    return null
}

export function getStepNames(): string[] {
    return Object.keys(STEPS)
}

export function getRoleNames(): string[] {
    return Object.keys(ROLES)
}
