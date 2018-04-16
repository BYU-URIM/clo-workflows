import { observer } from "mobx-react"
import {
    CommandBar,
    DetailsList,
    IGroup,
    IColumn,
    CheckboxVisibility,
    IGroupDividerProps,
    IRenderFunction,
    DefaultButton,
    IconType,
    PrimaryButton,
    CommandButton,
} from "office-ui-fabric-react"
import * as React from "react"
import { CloRequestElement } from "../model/CloRequestElement"

import { Message } from "./Message"
import { getStep, getStepNames } from "../model/loader/resourceLoaders"
import { StepName } from "../model/Step"
import { ClientViewState, ClientStoreData } from "../store/ClientStore/index"
import { NoteSource } from "../model/Note"
import { loadTheme, getTheme } from "office-ui-fabric-react/lib/Styling"
import { ThemeSettingName } from "@uifabric/styling/lib-es2015/styles/theme"

export interface IColumns {
    key: string
    name: string
    fieldName: string
    minWidth: number
    maxWidth: number
    isResizable: boolean
}
export interface IProjectGroup extends IGroup {
    submitterId: string
    Title?: string
    projectId: string
}
export interface ICustomGroup extends IGroup {
    projectId: string
}
export interface IProjectProcessListProps {
    messageVisible: boolean
    handleSubmit(projectId: string): void
    view: ClientViewState
    data: ClientStoreData
}
export interface ICustomGroupDividerProps extends IGroupDividerProps {
    group: ICustomGroup
}

const ProjectProcessList = observer((props: IProjectProcessListProps) => {
    const fields = ["title", "step"]
    const _columns = fields.map((f, i): IColumns => ({
        key: i.toString(),
        name: f.split(/(?=[A-Z])/).join(" "),
        fieldName: f,
        minWidth: 40,
        maxWidth: 300,
        isResizable: true,
    }))
    const _onRenderHeader = (renderHeaderProps: ICustomGroupDividerProps): JSX.Element => {
        return (
            <div>
                <div style={{ fontSize: "2em", marginRight: "10px" }}>
                    <strong>Project Name:</strong> {renderHeaderProps.group!.name}
                </div>

                <CommandButton
                    iconProps={{
                        iconName: "CircleAdditionSolid",
                    }}
                    text="Add a Process"
                    key={renderHeaderProps.group.key}
                    onClick={() => {
                        props.handleSubmit(renderHeaderProps.group.projectId.toString())
                    }}
                    disabled={props.messageVisible}
                />
                <CommandButton
                    iconProps={{
                        iconName: "ChevronRight",
                    }}
                    text="Project Notes"
                    key={`${renderHeaderProps.group.key}-select`}
                    onClick={() => {
                        props.view.project.id = renderHeaderProps.group.projectId.toString()
                        props.view.notesType = NoteSource.PROJECT
                    }}
                    disabled={props.messageVisible}
                />
            </div>
        )
    }
    return (
        <div
            style={{
                maxWidth: "750px",
                width: "100%",
            }}
        >
            <CommandBar
                items={[
                    {
                        key: "addNewProject",
                        name: "Add New Project",
                        icon: "Add",
                        onClick: () => {
                            props.view.modal = "project"
                        },
                        disabled: props.messageVisible,
                        style: {
                            fontSize: "1.5em",
                        },
                    },
                ]}
            />
            <DetailsList
                items={props.data.clientProcesses}
                groups={props.data.clientProjects}
                columns={_columns}
                checkboxVisibility={CheckboxVisibility.hidden}
                onRenderRow={(_props, defaultRender) => (
                    <div
                        style={{
                            fontSize: "1.5em",
                        }}
                        key={_props.item.key}
                        onClick={() => {
                            props.view.process.id = _props.item.key.toString()
                            props.view.work.id = _props.item.workId
                            props.view.notesType = NoteSource.WORK
                        }}
                    >
                        {defaultRender(_props)}
                    </div>
                )}
                groupProps={{
                    showEmptyGroups: true,
                    onRenderHeader: _onRenderHeader,
                }}
            />
        </div>
    )
})

export default ProjectProcessList
