import * as React from "react"
import { Spinner, SpinnerSize } from "office-ui-fabric-react"
import "./styles.scss"

export default function LoadingPage() {
    return (
        <div className="loadingPage-styles">
            <Spinner size={SpinnerSize.large} label="loading your projects..." />
        </div>
    )
}
