import { IView } from "../View"
import { IRole } from "../Role"
import * as VIEWS from "../../../res/json/form_templates/VIEWS.json"
import * as FORM_CONTROLS from "../../../res/json/form_templates/FORM_CONTROLS.json"
import * as STEPS from "../../../res/json/processing_config/PROCESS_STEPS.json"
import * as ROLES from "../../../res/json/processing_config/USER_ROLES.json"
import { deepCopy } from "../../utils"


// create model instances by loading raw JSON from res/json and denormalizing it
// all loaders should always use deepCopy(JSON) to create an instance so that the global JSON definition is not mutated

export function getView(viewName: string): IView {
    const normalizedView = VIEWS[viewName]
    return {
        formControls: normalizedView.formControls.map(formControlName => deepCopy(FORM_CONTROLS[formControlName])),
        dataSource: normalizedView.dataSource,
    }
}

export function getRole(roleName: string): IRole {
    const normalizedRole = ROLES[roleName]
    return {
        name: normalizedRole.name,
        permittedSteps: normalizedRole.permittedSteps.map(stepName => deepCopy(STEPS[stepName]))
    }

}