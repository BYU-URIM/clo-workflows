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
import { ClientStore, OBJECT_TYPES } from "../store/ClientStore"
import ProjectFormModal from "./ProjectFormModal"
import ProcessFormModal from "./ProcessFormModal"
import WorkFormModal from "./WorkFormModal"
import { Message } from "./Message"
import { getStep, getStepNames } from "../model/loader/resourceLoaders"
import { StepName } from "../model/Step"

/*******************************
 * TODO:
 * - view info for selected process
 * - view vs process issues
 * - form and general validation before submit
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
    clientStore: ClientStore
    /* processes for items in details list */
    _processes: Array<{}>
    _columns: Array<IColumns>
    _projects: IProjectGroup[]
    _onRenderHeader
    constructor(props: IProjectProcessListProps) {
        super(props)
        this.clientStore = this.props.clientStore
        this._processes = []

        const fields = ["Title", "step"]
        this._columns = fields.map((f, i): IColumns => ({
            key: i.toString(),
            name: f.split(/(?=[A-Z])/).join(" "),
            fieldName: f,
            minWidth: 75,
            maxWidth: 300,
            isResizable: false,
        }))

        this._onRenderHeader = (renderHeaderProps: IGroupDividerProps): JSX.Element => {
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
                            this.clientStore.updateClientStoreMember("projectId", renderHeaderProps.group.data.projectId, OBJECT_TYPES.NEW_PROCESS)
                            this.clientStore.updateViewState("showProcessModal", true)
                        }}
                    />
                </div>
            )
        }
    }
    public render() {
        // TODO should probably be moved to store
        this.clientStore.processes.map((proc, i) => {
            this._processes.push({
                key: i.toString(),
                Id: proc.Id,
                projectId: proc.projectId,
                Title: proc.Title,
                step: `${proc.step} - ${getStep(proc.step as StepName).stepId} out of ${getStepNames().length} `
            })
        })

        // TODO this is a lot of logic - should probably be moved to store
        this._projects = this.clientStore.projects
            .map((proj: CloRequestElement, i): IProjectGroup => ({
                key: i.toString(),
                data: {
                    projectId: proj.Id,
                },
                name: proj.Title.toString(),
                count: this.clientStore.processes.filter(proc => {
                    return proj.Id === Number(proc.projectId)
                }).length,
                submitterId: proj.submitterId.toString(),
                startIndex: 0,
                isShowingAll: false,
            }))
            .map((e, i, a) => {
                i > 0 ? (e.startIndex = a[i - 1].count + a[i - 1].startIndex) : (e.startIndex = 0)
                return e
            })
        /** TODO: After Demo
         *  these 3 modal forms need abstracted out for Dryer code,
         */
        return (
            <div>
                <ProjectFormModal
                    clientStore={this.clientStore}
                    togglePanel={(m, v?) => {
                        this.clientStore.updateViewState(m, v)
                    }}
                />
                <ProcessFormModal
                    clientStore={this.clientStore}
                    togglePanel={(m, v?) => {
                        this.clientStore.updateViewState(m, v)
                    }}
                />
                <WorkFormModal
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
                            onClick: () => this.clientStore.updateViewState("showProjectModal", true),
                        },
                        /*{ TODO add back in when separation is clear between add process / add work
                            key: "addNewWork",
                            name: "Add New Work",
                            icon: "Add",
                            onClick: () => this.clientStore.updateViewState("showWorkModal", true),
                        },*/
                    ]}
                />
                <DetailsList
                    items={this._processes}
                    groups={this._projects}
                    columns={this._columns}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    onRenderRow={(props, defaultRender) => <div>{defaultRender(props)}</div>}
                    groupProps={{
                        showEmptyGroups: true,
                        onRenderHeader: this._onRenderHeader,
                    }}
                />
                {this.clientStore.message && <Message {...this.clientStore.message} />}
            </div>
        )
    }
}
