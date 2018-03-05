import { inject, observer } from "mobx-react"
import { DefaultButton, DetailsList, IGroup } from "office-ui-fabric-react"
import * as React from "react"

import { CloRequestElement } from "../model/CloRequestElement"
import { ClientStore } from "../store/ClientStore"
import {PanelMediumExample} from "./FormPanel"
/*******************************
 * TODO:
 * display title instead of project id
 * add whichever fields should be displayed like status and details
 * clean up 'extras' in component
 * actions and state of selections
 * `
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

@inject("rootStore")
@observer
export class ProjectProcessList extends React.Component<any, any> {
    private selection: Selection
    clientStore: ClientStore
    /* processes for items in details list */
    _processes: Array<{}>
    _columns: Array<IColumns>
    _projects: IProjectGroup[]
    constructor(props: {}) {
        super(props)
        this._processes = []
        this.clientStore = this.props.rootStore.clientStore
        this._projects = this.clientStore.projects
            .map((proj: CloRequestElement): IProjectGroup => ({
                key: proj.Id.toString(),
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
        this.clientStore.processes.map(proc => {
            this._processes.push({
                Id: proc.Id,
                projectId: proc.projectId,
                submitterId: proc.submitterId,
                Title: proc.Title,
                ...proc,
            })
        })
        const fields = ["Id", "Title", "workId", "submitterId"]
        this._columns = fields.map((f, i): IColumns => ({
            key: f,
            name: f.split(/(?=[A-Z])/).join(" "),
            fieldName: f,
            minWidth: 75,
            maxWidth: 300,
            isResizable: true,
        }))
    }

    public render() {
        const addNewProject = () => {
            
        }
        return (
            <div>
                <DefaultButton onClick={() => console.log(this)} text="Add an item" />
                <DetailsList
                    items={this._processes}
                    compact={true}
                    groups={this._projects}
                    columns={this._columns}
                    groupProps={{ showEmptyGroups: true }}
                />
                <PanelMediumExample />
            </div>
        )
    }
}
