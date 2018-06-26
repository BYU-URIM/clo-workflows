import * as React from "react"
import { inject, observer } from "mobx-react"
import { PrimaryButton, IconButton } from "office-ui-fabric-react/lib/"
import { EmployeeStore } from "../../store"
import { NotesBox, FormControlGroup } from "../"
import { DB_CONFIG } from "../../../res"
import "./styles.scss"
@inject("rootStore")
@observer
export class ProjectDetail extends React.Component<any, any> {
    public componentWillMount() {
        this.employeeStore = this.props.rootStore.employeeStore
    }

    private employeeStore: EmployeeStore

    public render() {
        const requestDetailStore = this.employeeStore.requestDetailStore
        return (
            <div className="projectDetail-wrapper-styles">
                <div className="projectDetail-formColumn-styles">
                    <div className="projectDetail-projectHeader-styles">
                        <div className="projectDetail-title-styles">{requestDetailStore.canEditProject ? "Edit Project" : "View Project"}</div>
                        <div className="projectDetail-editButton-styles">
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={
                                    requestDetailStore.canEditProject
                                        ? { iconName: "BoxMultiplySolid" }
                                        : {
                                              iconName: "edit",
                                              styles: () => ({
                                                  root: {
                                                      fontSize: "1.4em",
                                                  },
                                              }),
                                          }
                                }
                                onClick={
                                    requestDetailStore.canEditProject ? requestDetailStore.stopEditingProject : requestDetailStore.startEditingProject
                                }
                            />
                        </div>
                        <div className="projectDetail-editButton-styles">
                            <IconButton
                                disabled={!requestDetailStore.isRequestActive}
                                iconProps={{
                                    iconName: "OpenFolderHorizontal",
                                    styles: () => ({
                                        root: {
                                            fontSize: "1.4em",
                                        },
                                    }),
                                }}
                                title="open project documents folder"
                                onClick={() => {
                                    const id = requestDetailStore.project.get("Id")
                                    const title = requestDetailStore.project.get("Title")
                                    const type = requestDetailStore.project.get("type")
                                    window.open(`${DB_CONFIG.hostUrl}/SiteAssets/${type} - ${title} - ${id}`)
                                }}
                            />
                        </div>
                    </div>
                    <FormControlGroup
                        data={requestDetailStore.project}
                        formControls={requestDetailStore.projectView.formControls}
                        updateFormField={requestDetailStore.updateProject}
                        validation={requestDetailStore.projectValidation}
                        width={350}
                    />
                    {requestDetailStore.canEditProject && (
                        <div className="projectDetail-submitButton-styles">
                            <PrimaryButton
                                text="Submit Changes"
                                onClick={requestDetailStore.submitProject}
                                disabled={!requestDetailStore.canSubmitProject}
                            />
                        </div>
                    )}
                </div>
                <div className="projectDetail-notesColumn-styles">
                    {requestDetailStore.projectNotesStore && <NotesBox notesStore={requestDetailStore.projectNotesStore} title="Project Notes" />}
                </div>
            </div>
        )
    }
}
