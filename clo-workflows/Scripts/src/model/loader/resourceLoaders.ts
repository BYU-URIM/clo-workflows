import { Role, View, FormControl, StepName, Step, IStep, IRole } from ".."
import { FORM_CONTROLS, VIEWS, STEPS, ROLES } from "../../../res/"
import Utils from "../../utils"

// create model instances by loading raw JSON from res/json and denormalizing it
// all loaders should always use deepCopy(JSON) to create a separate instance so that the global JSON definition is not mutated
export const getView = (viewName: string, userRole: IRole): View => {
    const isUserEmployee = userRole.name !== "LTT Client"
    const normalizedView = VIEWS[viewName]
    if (!normalizedView) throw new Error(`no view for ${viewName} exists`)

    // form controls in a single view are composed of the formFields array and the readonlyformFields array
    // the readonlyformFields appear first followed by the standard formFields
    let formFields: Array<FormControl> = []
    let useFields: Array<FormControl> = []
    if (isUserEmployee && normalizedView.privilegedFormFields) {
        formFields = formFields.concat(
            normalizedView.privilegedFormFields.map(formControlName => {
                const formControl = new FormControl(FORM_CONTROLS[formControlName])
                return formControl
            })
        )
    }

    // almost always, every readonly form control will be made readonly
    // the exception is for admin processes, in which the form control is created as is
    const readonlyAdminOverride: boolean = isUserEmployee && normalizedView.dataSource === "processes"

    // first add in the readonly form controls (if present)
    if (normalizedView.readonlyformFields) {
        formFields = formFields.concat(
            normalizedView.readonlyformFields.map(formControlName => {
                const formControl = new FormControl(FORM_CONTROLS[formControlName])
                // make the form control readonly, except for the special case of admin override
                if (!readonlyAdminOverride) formControl.makeReadOnly()
                return formControl
            })
        )
    }

    // next add in the standard form controls (if present)
    if (normalizedView.formFields) {
        formFields = formFields.concat(
            normalizedView.formFields.map(formControlName => {
                return new FormControl(FORM_CONTROLS[formControlName])
            })
        )
    }

    // next add in the use form controls (if present)
    if (normalizedView.useFields) {
        useFields = normalizedView.useFields.map(formControlName => {
            return new FormControl(FORM_CONTROLS[formControlName])
        })
    }

    return new View({
        formFields,
        useFields,
        dataSource: normalizedView.dataSource,
    })
}

// although the view JSON definitions are capable of defining a view with readonly and non-readonly form controls,
// this const programatically =  adds the readonly proprterty to all form controls of a view
// this constality =  is for instances when a view needs to be made readonly at runtime or when it is not practical
// to make multiple JSON view definitions differing only by readonly form controls
export const getViewAndMakeReadonly = (viewName: string, userRole: IRole): View => {
    const view = getView(viewName, userRole)
    view.formFields.forEach(formControl => formControl.makeReadOnly())
    view.useFields.forEach(useField => useField.makeReadOnly())
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

export const getStep = (stepName: StepName): Step => new Step(STEPS[stepName])

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

export const getStepNames = (): string[] => Object.keys(STEPS)

export const getRoleNames = (): string[] => Object.keys(ROLES)
