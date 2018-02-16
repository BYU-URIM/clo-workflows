import * as React from "react"
import {
    Spinner,
    SpinnerSize
  } from "office-ui-fabric-react/lib/Spinner"

const styles = {
    marginTop: "15%",
    transform: "scale(3, 3)"
} as React.CSSProperties

export function LoadingPage() {
    return (
        <div style={styles}>
            <Spinner size={ SpinnerSize.large } label="loading your projects..." />
        </div>
    )
}
