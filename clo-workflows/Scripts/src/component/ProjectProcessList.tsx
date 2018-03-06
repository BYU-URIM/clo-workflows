import { inject, observer } from "mobx-react"
import {
    DefaultButton,
    DetailsList,
    IGroup,
    CommandBar,
    SelectionMode,
    IContextualMenuItem,
    MarqueeSelection,
    SelectionZone,
} from "office-ui-fabric-react"
import * as React from "react"

import { CloRequestElement } from "../model/CloRequestElement"
import { ClientStore } from "../store/ClientStore"
import FormPanel from "./FormPanel"

/*******************************
 * TODO:
 * display title instead of project id
 * add whichever fields should be displayed like status and details
 * clean up 'extras' in component
 * actions and state of selections
 *******************************/

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
}
export interface IProjectProcessListProps {
    clientStore: ClientStore
}

@observer
export class ProjectProcessList extends React.Component<IProjectProcessListProps, any> {
    private selection: Selection
    clientStore: ClientStore
    /* processes for items in details list */
    _processes: Array<{}>
    _columns: Array<IColumns>
    _projects: IProjectGroup[]
    constructor(props: IProjectProcessListProps) {
        super(props)
        this.clientStore = this.props.clientStore
        this._processes = []
        this._projects = this.clientStore.projects
            .map((proj: CloRequestElement, i): IProjectGroup => ({
                key: i.toString(),
                name: proj.Title.toString(),
                count: this.clientStore.processes.filter(proc => {
                    return proj.Id === Number(proc.projectId)
                }).length,
                submitterId: proj.submitterId.toString(),
                startIndex: 0,
            }))
            .map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })
        this.clientStore.processes.map((proc, i) => {
            this._processes.push({
                key: i.toString(),
                Id: proc.Id,
                projectId: proc.projectId,
                submitterId: proc.submitterId,
                Title: proc.Title,
                ...proc,
            })
        })
        const fields = ["Id", "Title", "workId", "submitterId"]
        this._columns = fields.map((f, i): IColumns => ({
            key: i.toString(),
            name: f.split(/(?=[A-Z])/).join(" "),
            fieldName: f,
            minWidth: 75,
            maxWidth: 300,
            isResizable: true,
        }))
    }
    public render() {
        const addNewProject = () => {}
        return (
            <div>
                <FormPanel
                    clientStore={this.clientStore}
                    togglePanel={(m, v?) => {
                        this.clientStore.updateViewState(m, v)
                    }}
                />
                <CommandBar
                    items={[
                        {
                            key: "addNewProject",
                            name: "Add New Project",
                            icon: "Add",
                            onClick: () => this.clientStore.updateViewState("showProjectPanel", true),
                        },
                        {
                            key: "addNewProcess",
                            name: "Add Process to selected Project",
                            icon: "Add",
                            onClick: e => {
                                console.log(e.target)
                            },
                            disabled: !this.clientStore.isSelectedProject,
                        },
                    ]}
                />
                    <DetailsList
                        items={this._processes}
                        compact={true}
                        
                        groups={this._projects}
                        columns={this._columns}
                        groupProps={{
                            showEmptyGroups: true,
                        }}
                        selection={this.clientStore.selectedProject}
                        onActiveItemChanged={()=>this.clientStore.IsSelectedProject()}
                    />
            </div>
        )
    }
}
