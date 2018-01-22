import * as React from "react"
import { observer, inject } from "mobx-react"
import { EmployeeStore } from "../store/EmployeeStore"
import FormControlGroup from "./FormControlGroup"
import { Button } from "office-ui-fabric-react/lib/Button"
import { NonScrollableList } from "./NonScrollableList"

const wrapperStyles = {
    marginLeft: 30,
    marginTop: 40,
    marginBottom: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
} as React.CSSProperties

const notesWrapperStyles = {
    backgroundColor: "#F8F8F8",
    marginRight: "20%",
    maxWidth: 320,
    padding: 10,
}

const notesTitleStyles = {
    textAlign: "center",
    fontSize: 25,
    fontWeight: 600,
    marginBottom: 8,
} as React.CSSProperties

const newNoteButtonStyles = {
    display: "flex",
    justifyContent: "center",
} as React.CSSProperties

@inject("rootStore")
@observer
export class ProcessDetail extends React.Component<any, any> {

    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const { employeeStore } = this
        return (
            <div style={wrapperStyles}>
                <FormControlGroup
                    data={employeeStore.selectedProcess}
                    formControls={employeeStore.selectedProcessFormControls}
                    validation={employeeStore.selectedProcessValidation}
                    onChange={employeeStore.updateSelectedProcess}
                />
                <div style={notesWrapperStyles}>
                    <div style={notesTitleStyles}>Process Notes</div>
                    <div style={newNoteButtonStyles}>
                        <Button text="Add Note" primary />
                    </div>
                    <NonScrollableList
                        items={employeeStore.selectedProcessNotes}
                    />
                </div>
            </div>
        )
    }
}
