import * as React from "react"
import { inject, observer } from "mobx-react"
import { IUser } from "../model/User"
import Header from "./Header"
import FormControlGroup from "./FormControlGroup"
import {SessionStore} from "../store/SessionStore"
import {ClientStore} from "../store/ClientStore"
import {Dropdown} from "office-ui-fabric-react/lib/Dropdown"
import { SearchBox } from "office-ui-fabric-react/lib/SearchBox"
import { Checkbox } from "office-ui-fabric-react/lib/Checkbox"
import { WORK_TYPES, PROJECT_TYPES } from "../model/CloRequestElement"
export interface IWorkTypeDropdownProps {
  workTypes: Array<string>
  setNewProjectState: any
}
const styles = {
    main: {
        maxWidth: "350px",
        margin: "10px",
    },
    item: {
        margin: "10px 0px",
    },
}

@inject("rootStore")
@observer
export class Anonymous extends React.Component<any, any> {
    public componentWillMount() {
        this.sessionStore = this.props.rootStore.sessionStore
        this.clientStore = this.props.rootStore.clientStore
    }
    sessionStore: SessionStore
    clientStore: ClientStore

    render() {
        const options = [{ key: "Header", text: "Work Types", itemType: Header }]
        const {sessionStore, clientStore} = this
        const { newProject, newProjectState, DataService } = clientStore
        return (
            <div style={styles.main}>
                <Dropdown
                    className="WorkTypeDropdownClass"
                    label="Select the Project Type:"
                    selectedKey={
                        clientStore.newProjectState.projectType
                            ? clientStore.newProjectState.projectType
                            : undefined
                    }
                    options={Array.from(PROJECT_TYPES).map((field) => ({
                        text: field,
                        value: field,
                        key: field,
                    }))}
                    placeHolder="Select an Option"
                    onChanged={(e) => clientStore.updateNewProjectState(
                        {
                            projectType: e.text,
                            newProjectChecked:false,
                            workType:"", newWorkChecked:false,
                            testField:"working",
                        },
                    )}
                    style={styles.item}
                />
                {
                    clientStore.newProjectState.projectType && (
                    <div>
                        <SearchBox
                            onFocus={() => console.log("onFocus called")}
                            onBlur={() => console.log("onBlur called")}
                            style={styles.item}
                        />
                        <br/>
                        <Checkbox
                            label="Create new project"
                            style={styles.item}
                            checked={clientStore.newProjectState.newProjectChecked}
                            onChange={()=> clientStore.updateForm({newProjectChecked: !clientStore.newProjectState.newProjectChecked})}
                            />
                    </div>
                    )
                }
                {
                    (clientStore.currentnewProjectState.newProjectChecked) &&
                        (
                            <FormControlGroup
                            data={newProject}
                            formControls={clientStore
                                .DataService()
                                .getView(newProjectState.projectType)
                                .formControls}
                            validation={{}}
                            onChange={clientStore.updateNewProject}
                            />
                        )

                }
                {newProjectState.newProjectChecked && (
                    <div>
                        <Dropdown
                            label="Select the Work Type:"
                            selectedKey={
                                this.clientStore.newProjectState.workType
                                    ? this.clientStore.newProjectState.workType
                                    : undefined
                            }
                            options={Array.from(WORK_TYPES).map((field) => ({
                                text: field,
                                value: field,
                                key: field,
                            }))}
                            placeHolder="Select an Option"
                            onChanged={(e) => clientStore.updateNewProjectState({
                                workType: e.text,
                                newWorkChecked: false})}
                            style={styles.item}
                        />
                    </div>
                )}
                {clientStore.newProjectState.workType && (
                    <div>
                        <SearchBox
                            onFocus={() => console.log("onFocus called")}
                            onBlur={() => console.log("onBlur called")}
                        />
                        <br/>
                        <Checkbox
                            label="request new work"
                            style={styles.item}
                            checked={clientStore.newProjectState.newWorkChecked}
                            onChange={()=> clientStore.updateForm({
                                newWorkChecked: !clientStore.newProjectState.newWorkChecked,
                            })}
                            />                    </div>
                )}
                {clientStore.newProjectState.newWorkChecked && (
                    <div style={styles.item}>
                        <FormControlGroup
                            data={newProject}
                            formControls={clientStore
                                .DataService()
                                .getView(newProjectState.projectType)
                                .formControls}
                            validation={{}}
                            onChange={clientStore.updateNewProject}
                        />
                    </div>
                )}
            </div>
        )
    }
}
