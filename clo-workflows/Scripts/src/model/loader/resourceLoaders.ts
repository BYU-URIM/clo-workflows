import { Role, View, FormControl, StepName, Step, IStep, IRole } from ".."
import * as VIEWS from "../../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../../res/json/form_templates/FORM_CONTROLS.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import Utils from "../../utils"

// create model instances by loading raw JSON from res/json and denormalizing it
// all loaders should always use deepCopy(JSON) to create a separate instance so that the global JSON definition is not mutated
export const getView = (viewName: string, userRole: IRole): View => {
    const isUserEmployee = userRole.name !== "LTT Client"
    const isUserAdmin = userRole.name === "Administrator"
    const normalizedView = VIEWS[viewName]
    if (!normalizedView) throw new Error(`no view for ${viewName} exists`)

    // form controls in a single view are composed of the formControls array and the readonlyFormControls array
    // the readonlyFormControls appear first followed by the standard formControls
    let formControls: FormControl[] = []
    if (isUserEmployee && normalizedView.privilegedFormControls) {
        formControls = formControls.concat(
            normalizedView.privilegedFormControls.map(formControlName => {
                const formControl = new FormControl(FORM_CONTROLS[formControlName])
                return formControl
            })
        )
    }

    // almost always, every readonly form control will be made readonly
    // the exception is for admin processes, in which the form control is created as is
    const readonlyAdminOverride: boolean = isUserEmployee && normalizedView.dataSource === "processes"

    // first add in the readonly form controls (if present)
    if (normalizedView.readonlyFormControls) {
        formControls = formControls.concat(
            normalizedView.readonlyFormControls.map(formControlName => {
                const formControl = new FormControl(FORM_CONTROLS[formControlName])
                // make the form control readonly, except for the special case of admin override
                if (!readonlyAdminOverride) formControl.makeReadOnly()
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
// this const programatically =  adds the readonly proprterty to all form controls of a view
// this constality =  is for instances when a view needs to be made readonly at runtime or when it is not practical
// to make multiple JSON view definitions differing only by readonly form controls
export const getViewAndMakeReadonly = (viewName: string, userRole: IRole): View => {
    const view = getView(viewName, userRole)
    view.formControls.forEach(formControl => formControl.makeReadOnly())
    return view
}

export const getRole = (roleName: string): Role => {
    const normalizedRole = ROLES[roleName] || getRole("LTT Client")
    return new Role({
        name: normalizedRole.name,
        permittedSteps: normalizedRole.permittedSteps.map(stepName => Utils.deepCopy(STEPS[stepName])),
        rank: normalizedRole.rank,
    })
}

export const getStep = (stepName: StepName): Step => {
    return new Step(STEPS[stepName])
}

export const getStepById = (id: number): Step => {
    for (const stepName in STEPS) {
        if (STEPS[stepName].orderId === id) return new Step(STEPS[stepName])
    }
}

export const getStepForProcessFieldName = (processFieldName: string): Step => {
    for (const stepName in STEPS) {
        const step: IStep = STEPS[stepName]
        if (step.processFieldNames.includes(processFieldName)) return new Step(step)
    }
    return null
}

export const getStepNames = (): string[] => {
    return Object.keys(STEPS)
}

export const getRoleNames = (): string[] => {
    return Object.keys(ROLES.default)
}
