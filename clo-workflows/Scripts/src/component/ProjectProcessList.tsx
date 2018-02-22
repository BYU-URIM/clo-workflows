import { inject, observer } from "mobx-react"
import { DefaultButton, DetailsList, IGroup } from "office-ui-fabric-react"
import * as React from "react"

import { ICloRequestElement } from "../model/CloRequestElement"
import { ClientStore } from "../store/ClientStore"

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
export interface IColumnsArray {}

@inject("rootStore")
@observer
export class ProjectProcessList extends React.Component<any, any> {
    /* Not currently used... */
    private selection: Selection
    clientStore: ClientStore
    _processes: Array<{ projectId: any; processes?: Array<ICloRequestElement>; key: number; process: string; projectTitle: string }>
    projects: Array<ICloRequestElement>
    _columns: Array<IColumns>
    _groups: IGroup[]
    constructor(props: {}) {
        super(props)
        this._processes = []
        this.clientStore = this.props.rootStore.clientStore
        this._groups = this.clientStore.projects
            .map((proj: ICloRequestElement): IGroup => ({
                key: proj.id.toString(),
                name: proj.title.toString(),
                count: this.clientStore.processes.filter(proc => {
                    return proj.id === proc.projectId
                }).length,
                startIndex: 0,
            }))
            .map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })

        this.clientStore.processes.map((_proj) => {
            this._processes.push({
                key: Number(_proj.id),
                projectId: _proj.projectId,
                process: _proj.step.toString(),
                processes: [],
                projectTitle: this.clientStore.projects[Number(_proj.projectId)].title.toString(),
            })
        })
        this._columns = [
            {
                key: "project",
                name: "Project",
                fieldName: "projectId",
                minWidth: 100,
                maxWidth: 200,
                isResizable: true,
            },
            {
                key: "process",
                name: "Process",
                fieldName: "step",
                minWidth: 100,
                maxWidth: 200,
                isResizable: true,
            },
            {
                key: "date",
                name: "Date",
                fieldName: "dateSubmittedToCurrentStep",
                minWidth: 100,
                maxWidth: 200,
                isResizable: true,
            },
        ]
        console.log(this)
    }

    public render() {
        return (
            <div>
                <DefaultButton onClick={() => console.log(this._groups)} text="Add an item" />
                <DetailsList items={this.clientStore.processes} groups={this._groups} columns={this._columns} />
            </div>
        )
    }
}
