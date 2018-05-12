import * as React from "react"
import "./styles.scss"

import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner"

export default function LoadingPage() {
    return (
        <div className="loadingPage-styles">
            <Spinner size={SpinnerSize.large} label="loading your projects..." />
        </div>
    )
}
