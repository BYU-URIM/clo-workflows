import * as React from "react"
import { EmployeeStore } from "../store/EmployeeStore/EmployeeStore"
import { inject, observer } from "mobx-react"
import FormControlGroup from "./FormControlGroup"
import { NotesBox } from "./NotesBox"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/Button"
import { SessionStore } from "../store/SessionStore"
import { NoteScope, NoteSource } from "../model/Note"
import { RequestDetailStore } from "../store/EmployeeStore/RequestDetailStore"

const wrapperStyle = {
    padding: "20 0",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
    background: "#F8F8F8",
} as React.CSSProperties

const titleStlyes = {
    textAlign: "center",
    marginBottom: "10",
    font: "30px Segoe UI, sans-serif",
    width: 350
} as React.CSSProperties

const submitButtonStlyes = {
    display: "flex",
    justifyContent: "center",
    marginTop: 30,
    marginRight: 25
} as React.CSSProperties

const editButtonStyles = { transform: "translateX(-25px)" }
const workHeaderStyles = { display: "flex" } as React.CSSProperties
const formColumnStyles = { padding: "0 8 0 30" }
const notesColumnStyles = { padding: "0 30 0 8" }

@inject("rootStore")
@observer
export class WorkDetail extends React.Component<any, any> {

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
        this.sessionStore = this.props.rootStore.sessionStore
    }

    private employeeStore: EmployeeStore
    private sessionStore: SessionStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div style={wrapperStyle}>
                <div style={formColumnStyles}>
                    <div style={workHeaderStyles}>
                        <div style={titleStlyes}>{requestDetailStore.canEditWork ? "Edit Work" : "View Work"}</div>
                        <div style={editButtonStyles}>
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={ requestDetailStore.canEditWork ? {iconName: "BoxMultiplySolid"} : {iconName: "edit"} }
                                onClick={requestDetailStore.canEditWork
                                    ? requestDetailStore.stopEditingWork
                                    : requestDetailStore.startEditingWork
                                }
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
                    {
                        requestDetailStore.canEditWork &&
                        <div style={submitButtonStlyes}>
                            <PrimaryButton text="Submit Changes"
                                onClick={requestDetailStore.submitWork}
                                disabled={!requestDetailStore.canSubmitWork}
                            />
                        </div>
                    }
                </div>
                <div style={notesColumnStyles}>
                {
                    requestDetailStore.workNotesStore &&
                    <NotesBox
                        notesStore={requestDetailStore.workNotesStore}
                        title="Work Notes"
                    />
                }
                </div>
            </div>
        )
    }
}
