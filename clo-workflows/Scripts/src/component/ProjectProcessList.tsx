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
    processes: Array<{}>
    projects: IProjectGroup[]
    handleSubmit(projectId: string): void
    updateView(k: string, v: any): void
    message
}
export interface ICustomGroupDividerProps extends IGroupDividerProps {
    group: ICustomGroup
}

export const ProjectProcessList = (props: IProjectProcessListProps) => {
    const fields = ["title", "step"]
    const _columns = fields.map((f, i): IColumns => ({
        key: i.toString(),
        name: f.split(/(?=[A-Z])/).join(" "),
        fieldName: f,
        minWidth: 75,
        maxWidth: 300,
        isResizable: false,
    }))
    const _onRenderHeader = (renderHeaderProps: ICustomGroupDividerProps): JSX.Element => {
        return (
            <div>
                <span style={{ fontSize: "1.7em", marginRight: "10px" }}>
                    <strong>Project Name:</strong> {renderHeaderProps.group!.name}
                </span>

                <CommandButton
                    iconProps={{
                        iconName: "Add",
                    }}
                    text="Add a Process"
                    key={renderHeaderProps.group.key}
                    onClick={e => {
                        props.handleSubmit(renderHeaderProps.group.projectId.toString())
                    }}
                />
            </div>
        )
    }
    return (
        <div>
            <CommandBar
                items={[
                    {
                        key: "addNewProject",
                        name: "Add New Project",
                        icon: "Add",
                        onClick: () => props.updateView("showProjectModal", true),
                    },
                ]}
            />
            <DetailsList
                items={props.processes}
                groups={props.projects}
                columns={_columns}
                checkboxVisibility={CheckboxVisibility.hidden}
                onRenderRow={(_props, defaultRender) => <div>{defaultRender(_props)}</div>}
                groupProps={{
                    showEmptyGroups: true,
                    onRenderHeader: _onRenderHeader,
                }}
            />
        </div>
    )
}
