import * as React from "react"
import { EmployeeStore, SessionStore } from "../../store/"
import { inject, observer } from "mobx-react"
import { FormControlGroup, NotesBox } from "../"
// tslint:disable-next-line:no-submodule-imports
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/"
import "./styles.scss"

@inject("rootStore")
@observer
export default class WorkDetail extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div className="workDetail-wrapper-styles">
                <div className="formColumn-styles">
                    <div className="workHeader-styles">
                        <div className="title-styles">{requestDetailStore.canEditWork ? "Edit Work" : "View Work"}</div>
                        <div className="editButton-styles">
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={{
                                    styles: () => ({
                                        root: {
                                            fontSize: "1.4em",
                                        },
                                    }),
                                    iconName: requestDetailStore.canEditWork ? "BoxMultiplySolid" : "edit",
                                }}
                                onClick={requestDetailStore.canEditWork ? requestDetailStore.stopEditingWork : requestDetailStore.startEditingWork}
                            />
                        </div>
                    </div>
                    <FormControlGroup
                        data={requestDetailStore.work}
                        formControls={requestDetailStore.workView.formControls}
                        updateFormField={requestDetailStore.updateWork}
                        validation={requestDetailStore.workValidation}
                        width={350}
                    />
                    {requestDetailStore.canEditWork && (
                        <div className="submitButton-styles">
                            <PrimaryButton
                                text="Submit Changes"
                                onClick={requestDetailStore.submitWork}
                                disabled={!requestDetailStore.canSubmitWork}
                            />
                        </div>
                    )}
                </div>
                <div className="notesColumn-styles">
                    {requestDetailStore.workNotesStore && <NotesBox notesStore={requestDetailStore.workNotesStore} title="Work Notes" />}
                </div>
            </div>
        )
    }
}
