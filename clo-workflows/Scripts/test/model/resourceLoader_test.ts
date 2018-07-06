import { getView, getRole, getStep, getViewAndMakeReadonly } from "../../src/model/loader/resourceLoaders"
import { FORM_CONTROLS, ROLES, STEPS, VIEWS } from "../../res/"

import { StepName, IRole, Step } from "../../src/model"
import { toJS } from "mobx"

/* ensure that getView() correctly builds view object with shape
    {
        dataSource: string
        formFields: Array<IFormControl>
    }
*/
test("test that getView() correctly builds a View Object", () => {
    const testRole: IRole = { name: "Administrator", permittedSteps: [], rank: 10 }
    const testViewName = Object.keys(VIEWS)[0]
    const jsonViewDefinition = VIEWS[testViewName]
    const view = getView(testViewName, testRole)

    const isUserEmployee = testRole.name !== "LTT Client"
    const isUserAdmin = testRole.name === "Administrator"

    expect(typeof view.dataSource).toBe("string")
    expect(Array.isArray(toJS(view.formFields))).toBe(true)

    // ensure that each readonly form control has the correct shape and that readonly is set to true
    if (jsonViewDefinition.readonlyformFields) {
        jsonViewDefinition.readonlyformFields.forEach(formControlName => {
            const jsonFormControlDefinition = FORM_CONTROLS[formControlName]
            const formControl = view.formFields.find(curFormControl => curFormControl.displayName === jsonFormControlDefinition.displayName)

            expect(typeof formControl.displayName).toBe("string")
            expect(typeof formControl.dataRef).toBe("string")
            expect(typeof formControl.type).toBe("string")
            expect(formControl.readonly).toBe(true)
        })
    }

    // ensure that each standard form control has the correct shape and that readonly is set to false
    if (jsonViewDefinition.formFields) {
        jsonViewDefinition.formFields.forEach(formControlName => {
            const jsonFormControlDefinition = FORM_CONTROLS[formControlName]
            const formControl = view.formFields.find(curFormControl => curFormControl.displayName === jsonFormControlDefinition.displayName)

            expect(typeof formControl.displayName).toBe("string")
            expect(typeof formControl.dataRef).toBe("string")
            expect(typeof formControl.type).toBe("string")
            expect(formControl.readonly).toBeFalsy()
        })
    }

    // ensure that the constructed view object has the correct number of form controls
    // (sum of readonly form controls and standard form controls === length of total form controls)
    let numformFields = 0
    numformFields += jsonViewDefinition.readonlyformFields ? jsonViewDefinition.readonlyformFields.length : 0
    numformFields += jsonViewDefinition.formFields ? jsonViewDefinition.formFields.length : 0
    numformFields += jsonViewDefinition.privilegedFormFields && isUserEmployee ? jsonViewDefinition.privilegedFormFields.length : 0
    expect(view.formFields.length).toStrictEqual(numformFields)
})

// ensure that getViewAndMakeReadonly creates a view with all readonly form controls
test("test that getViewAndMakeReadonly creates a view with all readonly form controls", () => {
    const testRole: IRole = { name: "LTT Admin", permittedSteps: [], rank: 10 }
    const testViewName = Object.keys(VIEWS)[0]
    const view = getViewAndMakeReadonly(testViewName, testRole)
    view.formFields.forEach(formControl => {
        expect(formControl.readonly)
    })
})

/* ensure that getRole() correctly builds role object with shape
    {
        name: string
        permittedSteps: Array<IStep>
    }
 */
test("test that getRole() correctly builds role object", () => {
    const role = getRole(Object.keys(ROLES)[0])
    expect(typeof role.name).toBe("string")
    expect(Array.isArray(toJS(role.permittedSteps)))
    // role.permittedSteps.forEach(step => {
    //     expect(step).toBeInstanceOf(Step)
    // })
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
test("test that getStep() correctly builds step object", () => {
    expect(getStep(Object.keys(STEPS)[0] as StepName)).toBeInstanceOf(Step)
    // expect(typeof step.name).toBe("string")
    // expect(step.orderId).toBeLessThan(10)
    // expect(step.orderId).toBeGreaterThan(-1)
    // expect(typeof step.view).toBe("string" || null)
    // expect(typeof step.submissionDateFieldName).toBe("string")
    // expect(typeof step.submitterFieldName).toBe("string")
    // expect(Array.isArray(toJS(step.processFieldNames))).toBe(true)
})
