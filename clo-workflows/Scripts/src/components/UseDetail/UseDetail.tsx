import * as React from "react"
import { inject, observer } from "mobx-react"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/"
import { EmployeeStore } from "../../store"
import { FormControlGroup } from ".."
import "./styles.scss"
@inject("rootStore")
@observer
export class UseDetail extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div className="useDetail-wrapper-styles">
                <div className="useDetail-formColumn-styles">
                    <div className="useDetail-useHeader-styles">
                        <div className="useDetail-title-styles">{requestDetailStore.canEditUse ? "Edit Use" : "View Use"}</div>
                        <div className="useDetail-editButton-styles">
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={
                                    requestDetailStore.canEditUse
                                        ? { iconName: "BoxMultiplySolid" }
                                        : {
                                              iconName: "edit",
                                              styles: () => ({
                                                  root: {
                                                      fontSize: "1.4em",
                                                  },
                                              }),
                                          }
                                }
                                onClick={requestDetailStore.canEditUse ? requestDetailStore.stopEditingUse : requestDetailStore.startEditingUse}
                            />
                        </div>
                    </div>
                    <FormControlGroup
                        data={requestDetailStore.use}
                        formFields={requestDetailStore.useView.useFields}
                        updateFormField={requestDetailStore.updateUse}
                        validation={requestDetailStore.useValidation}
                        width={350}
                    />
                    {requestDetailStore.canEditUse && (
                        <div className="useDetail-submitButton-styles">
                            <PrimaryButton text="Submit Changes" onClick={requestDetailStore.submitUse} disabled={!requestDetailStore.canSubmitUse} />
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
