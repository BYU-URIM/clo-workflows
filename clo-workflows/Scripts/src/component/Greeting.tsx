import * as React from "react"
import { observer } from "mobx-react"

interface IGreetingProps {
    user: string // name of current user
}

function Greeting(props: IGreetingProps) {
    return (
        <div>{`hello ${props.user}`}</div>
    )
}

export default observer(Greeting)
