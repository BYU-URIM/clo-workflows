import * as React from "react"
import { observer, inject } from "mobx-react"
import { ClientStore } from "../store/ClientStore"
import { NonScrollableList } from "./NonScrollableList"
import { RoleSteps } from "./RoleSteps"

const wrapperStyle = { margin: "0 32" }
const textStyle = {
    font: "20px Segoe UI, sans-serif",
    color: "#202020",
    fontWeight: 200,
} as React.CSSProperties

@inject("rootStore")
@observer
export class EmployeeDashboard extends React.Component<any, any> {

    public componentWillMount() {
        this.clientStore = this.props.rootStore.clientStore
    }

    private clientStore: ClientStore

    public render() {
        const { clientStore } = this
        return (
            <div>
                {

                }
            </div>
        )
    }
}
