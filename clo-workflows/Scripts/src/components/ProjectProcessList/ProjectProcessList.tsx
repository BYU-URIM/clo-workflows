import { observer } from "mobx-react"
import { CommandBar, DetailsList, IGroup, CheckboxVisibility, IGroupDividerProps, CommandButton } from "office-ui-fabric-react/lib/"
import * as React from "react"
import { NoteSource } from "../../model"

import "./styles.scss"
import { ClientViewState, ClientStoreData } from "../../store"

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
    type: string
}
export interface ICustomGroup extends IGroup {
    projectId: string
}
export interface IProjectProcessListProps {
    asyncPendingLockout: boolean
    handleSubmit(projectId: string): void
    view: ClientViewState
    data: ClientStoreData
}
export interface ICustomGroupDividerProps extends IGroupDividerProps {
    group: ICustomGroup
}

export const ProjectProcessList = observer((props: IProjectProcessListProps) => {
    const _columns: Array<IColumns> = [
        {
            key: "1",
            name: "title",
            fieldName: "title",
            minWidth: 100,
            maxWidth: 500,
            isResizable: true,
        },
        {
            key: "2",
            name: "step",
            fieldName: "step",
            minWidth: 225,
            maxWidth: 300,
            isResizable: true,
        },
    ]

    const _onRenderHeader = (renderHeaderProps: ICustomGroupDividerProps): JSX.Element => {
        return (
            <div>
                <div className="projectProcessList-header-styles">
                    <strong>Project Name:</strong> {renderHeaderProps.group!.name}
                </div>

                <CommandButton
                    iconProps={{
                        iconName: "CircleAdditionSolid",
                    }}
                    text="Add a Work"
                    key={renderHeaderProps.group.key}
                    onClick={() => {
                        props.view.project.id = renderHeaderProps.group.projectId.toString()
                        props.handleSubmit(renderHeaderProps.group.projectId.toString())
                    }}
                    disabled={props.asyncPendingLockout}
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
                    disabled={props.asyncPendingLockout}
                />
            </div>
        )
    }
    return (
        <div className="projectProcessList-styles">
            <CommandBar
                items={[
                    {
                        key: "addNewProject",
                        name: "Add New Project",
                        // icon: "Add",
                        iconProps: {
                            iconName: "Add",
                        },
                        onClick: () => {
                            props.view.modal = "project"
                        },
                        disabled: props.asyncPendingLockout,
                        className: "projectProcessList-larger-styles",
                    },
                ]}
            />
            <DetailsList
                items={props.data.clientProcesses}
                groups={props.data.clientProjects}
                columns={_columns}
                compact={true}
                checkboxVisibility={CheckboxVisibility.hidden}
                onRenderRow={(_props, defaultRender) => (
                    <div
                        className="projectProcessList-larger-styles"
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
