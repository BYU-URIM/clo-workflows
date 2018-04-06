import * as ava from "ava"
import { getView, getRole, getStep, getViewAndMakeReadonly } from "../../src/model/loader/resourceLoaders"
import * as VIEWS from "../../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../../res/json/form_templates/FORM_CONTROLS.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import { StepName } from "../../src/model/Step"
import { toJS } from "mobx"

/* ensure that getView() correctly builds view object with shape
    {
        dataSource: string
        formControls: Array<IFormControl>
    }
*/
ava.test("test that getView() correctly builds a View Object", t => {
    const testViewName = Object.keys(VIEWS)[0]
    const jsonViewDefinition = VIEWS[testViewName]
    const view = getView(testViewName)

    t.true(typeof view.dataSource === "string")
    t.true(Array.isArray(toJS(view.formControls)))

    // ensure that each readonly form control has the correct shape and that readonly is set to true
    if(jsonViewDefinition.readonlyFormControls) {
        jsonViewDefinition.readonlyFormControls.forEach(formControlName => {
            const jsonFormControlDefinition = FORM_CONTROLS[formControlName]
            const formControl = view.formControls.find(curFormControl => curFormControl.displayName === jsonFormControlDefinition.displayName)

            t.true(typeof formControl.displayName === "string")
            t.true(typeof formControl.dataRef === "string")
            t.true(typeof formControl.type === "string")
            t.true(formControl.readonly)
        })
    }

    // ensure that each standard form control has the correct shape and that readonly is set to false
    if(jsonViewDefinition.formControls) {
        jsonViewDefinition.formControls.forEach(formControlName => {
            const jsonFormControlDefinition = FORM_CONTROLS[formControlName]
            const formControl = view.formControls.find(curFormControl => curFormControl.displayName === jsonFormControlDefinition.displayName)

            t.true(typeof formControl.displayName === "string")
            t.true(typeof formControl.dataRef === "string")
            t.true(typeof formControl.type === "string")
            t.falsy(formControl.readonly)
        })
    }

    // ensure that the constructed view object has the correct number of form controls
    // (sum of readonly form controls and standard form controls === length of total form controls)
    let numFormControls = 0
    numFormControls += jsonViewDefinition.readonlyFormControls ? jsonViewDefinition.readonlyFormControls.length : 0
    numFormControls += jsonViewDefinition.formControls ? jsonViewDefinition.formControls.length : 0
    t.true(view.formControls.length === numFormControls)
})


// ensure that getViewAndMakeReadonly creates a view with all readonly form controls
ava.test("test that getViewAndMakeReadonly creates a view with all readonly form controls", t => {
    const testViewName = Object.keys(VIEWS)[0]
    const view = getViewAndMakeReadonly(testViewName)
    view.formControls.forEach(formControl => {
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
