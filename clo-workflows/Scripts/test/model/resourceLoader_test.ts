import * as ava from "ava"
import { getView, getRole, getStep, getViewAndMakeReadonly } from "../../src/model/loader/resourceLoaders"
import { FORM_CONTROLS, ROLES, STEPS, VIEWS } from "../../res/"

import { StepName, IRole } from "../../src/model"
import { toJS } from "mobx"

/* ensure that getView() correctly builds view object with shape
    {
        dataSource: string
        formFields: Array<IFormControl>
    }
*/
ava.test("test that getView() correctly builds a View Object", t => {
    const testRole: IRole = { name: "Administrator", permittedSteps: [], rank: 10 }
    const testViewName = Object.keys(VIEWS)[0]
    const jsonViewDefinition = VIEWS[testViewName]
    const view = getView(testViewName, testRole)

    const isUserEmployee = testRole.name !== "LTT Client"
    const isUserAdmin = testRole.name === "Administrator"

    t.true(typeof view.dataSource === "string")
    t.true(Array.isArray(toJS(view.formFields)))

    // ensure that each readonly form control has the correct shape and that readonly is set to true
    if (jsonViewDefinition.readonlyformFields) {
        jsonViewDefinition.readonlyformFields.forEach(formControlName => {
            const jsonFormControlDefinition = FORM_CONTROLS[formControlName]
            const formControl = view.formFields.find(curFormControl => curFormControl.displayName === jsonFormControlDefinition.displayName)

            t.true(typeof formControl.displayName === "string")
            t.true(typeof formControl.dataRef === "string")
            t.true(typeof formControl.type === "string")
            t.true(formControl.readonly)
        })
    }

    // ensure that each standard form control has the correct shape and that readonly is set to false
    if (jsonViewDefinition.formFields) {
        jsonViewDefinition.formFields.forEach(formControlName => {
            const jsonFormControlDefinition = FORM_CONTROLS[formControlName]
            const formControl = view.formFields.find(curFormControl => curFormControl.displayName === jsonFormControlDefinition.displayName)

            t.true(typeof formControl.displayName === "string")
            t.true(typeof formControl.dataRef === "string")
            t.true(typeof formControl.type === "string")
            t.falsy(formControl.readonly)
        })
    }

    // ensure that the constructed view object has the correct number of form controls
    // (sum of readonly form controls and standard form controls === length of total form controls)
    let numformFields = 0
    numformFields += jsonViewDefinition.readonlyformFields ? jsonViewDefinition.readonlyformFields.length : 0
    numformFields += jsonViewDefinition.formFields ? jsonViewDefinition.formFields.length : 0
    numformFields += jsonViewDefinition.privilegedFormFields && isUserEmployee ? jsonViewDefinition.privilegedFormFields.length : 0
    t.deepEqual(view.formFields.length, numformFields)
})

// ensure that getViewAndMakeReadonly creates a view with all readonly form controls
ava.test("test that getViewAndMakeReadonly creates a view with all readonly form controls", t => {
    const testRole: IRole = { name: "LTT Admin", permittedSteps: [], rank: 10 }
    const testViewName = Object.keys(VIEWS)[0]
    const view = getViewAndMakeReadonly(testViewName, testRole)
    view.formFields.forEach(formControl => {
        t.true(formControl.readonly)
    })
})

/* ensure that getRole() correctly builds role object with shape
    {
        name: string
        permittedSteps: Array<IStep>
    }
 */
ava.test("test that getRole() correctly builds role object", t => {
    const role = getRole(Object.keys(ROLES)[0])
    t.true(typeof role.name === "string")
    t.true(Array.isArray(toJS(role.permittedSteps)))
    role.permittedSteps.forEach(step => {
        t.true(typeof step.name === "string")
        t.regex(String(step.orderId), /[0-9]+/)
        t.true(typeof step.view === "string" || step.view == null)
        t.true(typeof step.submissionDateFieldName === "string")
        t.true(typeof step.submitterFieldName === "string")
    })
})

/* ensure that getStep() correctly builds step object with shape
    {
        name: StepName // string identifier used mostly for display purposes
        orderId: number
        view: string // contains the name of a view, which is a list of form controls displayed at this step
        submitterIdFieldName: string // name of the process field name corresponding to the ID of the last person to submit the process at this step
        submissionDateFieldName: string // name of the process field name corresponding to the date this item was submitted at this step
    }
 */
ava.test("test that getStep() correctly builds step object", t => {
    const step = getStep(Object.keys(STEPS)[0] as StepName)
    t.true(typeof step.name === "string")
    t.regex(String(step.orderId), /[0-9]+/)
    t.true(typeof step.view === "string" || step.view == null)
    t.true(typeof step.submissionDateFieldName === "string")
    t.true(typeof step.submitterFieldName === "string")
    t.true(Array.isArray(toJS(step.processFieldNames)))
})
