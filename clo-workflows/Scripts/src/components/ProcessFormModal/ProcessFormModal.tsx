import * as React from "react"
import { observer } from "mobx-react"
import { Dropdown, Checkbox, DefaultButton, PrimaryButton } from "office-ui-fabric-react"
import { Modal } from "office-ui-fabric-react/lib/components/Modal/Modal"
import { ClientStore } from "../../store"
import { WorkForm } from "../"
import "./styles.scss"

export interface IFormPanelProps {
    clientStore: ClientStore
}

const ProcessFormModal = observer((props: IFormPanelProps) => {
    return (
        <Modal
            isOpen={true}
            onDismiss={() => {
                props.clientStore.view.modal = null
            }}
            isBlocking={true}
        >
            <div className="processFormModal-styles">
                <h2>New Process Form</h2>
                <Checkbox
                    label={"add a new work"}
                    checked={props.clientStore.view.work.isNew}
                    onChange={(m, v) => {
                        props.clientStore.newProcess.set("projectId", props.clientStore.view.project.id)
                        props.clientStore.view.modal = "process"
                        props.clientStore.view.work.isNew = v
                        props.clientStore.view.work.type = ""
                    }}
                />
                {props.clientStore.view.work.isNew ? (
                    <WorkForm clientStore={props.clientStore} />
                ) : (
                    <Dropdown
                        label="Select the Work:"
                        selectedKey={props.clientStore.view.work.type ? props.clientStore.view.work.type : undefined}
                        options={props.clientStore.data.works.map((field, index) => {
                            return {
                                text: field.Title,
                                value: field.Title,
                                key: field.Id,
                            }
                        })}
                        className="processFormModal-dropdown-styles"
                        placeHolder={props.clientStore.view.work.type ? props.clientStore.view.work.type : "select a Work"}
                        onChanged={e => {
                            props.clientStore.view.work.id = e.key.toString()
                        }}
                        disabled={props.clientStore.view.asyncPendingLockout}
                    />
                )}

                <PrimaryButton
                    description="Submit Process Request"
                    onClick={props.clientStore.processClientRequest}
                    text="Submit Work Request"
                    disabled={
                        props.clientStore.view.asyncPendingLockout ||
                        ((!props.clientStore.view.work.id && !(props.clientStore.newWork.get("Title") !== undefined)) ||
                            !(props.clientStore.newWork.get("Title") !== ""))
                    }
                />
                <br />
                <br />

                <DefaultButton
                    text="Close"
                    description="close without submitting"
                    onClick={() => {
                        props.clientStore.clearState()
                    }}
                    disabled={props.clientStore.view.asyncPendingLockout}
                />
            </div>{" "}
        </Modal>
    )
})
export default observer(ProcessFormModal)
