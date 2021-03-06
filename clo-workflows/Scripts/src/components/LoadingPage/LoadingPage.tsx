import * as React from "react"
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/"
import "./styles.scss"

export const LoadingPage = () => {
    return (
        <div className="loadingPage-styles">
            <Spinner size={SpinnerSize.large} label="loading your projects..." />
        </div>
    )
}
