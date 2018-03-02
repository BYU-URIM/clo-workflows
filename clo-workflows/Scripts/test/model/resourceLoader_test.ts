import * as ava from "ava"
import { getView, getRole, getStep } from "../../src/model/loader/resourceLoaders"
import * as VIEWS from "../../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../../res/json/form_templates/FORM_CONTROLS.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import { StepName } from "../../src/model/Step"

/* ensure that getView() correctly builds view object with shape
    {
        dataSource: string
        formControls: Array<IFormControl>
    }
*/
ava.test("test that getView() correctly builds a View Object", t => {
    const view = getView(Object.keys(VIEWS)[0])

    t.true(typeof view.dataSource === "string")
    t.true(Array.isArray(view.formControls))
    view.formControls.forEach(formControl => {
        t.true(typeof formControl.displayName === "string")
        t.true(typeof formControl.dataRef === "string")
        t.true(typeof formControl.type === "string")
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
    t.true(Array.isArray(role.permittedSteps))
    role.permittedSteps.forEach(step => {
        t.true(typeof step.name === "string")
        t.regex(String(step.stepId), /[0-9]+/)
        t.true(typeof step.view === "string" || step.view == null)
        t.true(typeof step.submissionDateDataRef === "string")
        t.true(typeof step.submitterIdDataRef === "string")
    })
})

/* ensure that getStep() correctly builds step object with shape
    {
        name: StepName // string identifier used mostly for display purposes
        stepId: number
        view: string // contains the name of a view, which is a list of form controls displayed at this step
        submitterIdDataRef: string // name of the process field name corresponding to the ID of the last person to submit the process at this step
        submissionDateDataRef: string // name of the process field name corresponding to the date this item was submitted at this step
    }
 */
ava.test("test that getStep() correctly builds step object", t => {
    const step = getStep(Object.keys(STEPS)[0] as StepName)
    t.true(typeof step.name === "string")
    t.regex(String(step.stepId), /[0-9]+/)
    t.true(typeof step.view === "string" || step.view == null)
    t.true(typeof step.submissionDateDataRef === "string")
    t.true(typeof step.submitterIdDataRef === "string")
})
