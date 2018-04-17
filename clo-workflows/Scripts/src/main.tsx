import * as React from "react"
import * as ReactDom from "react-dom"
import { useStrict } from "mobx"
import { BrowserRouter, Router } from "react-router-dom"
import { App } from "./component/"
import { Provider } from "mobx-react"
import { RootStore } from "./store/"
import { DataServiceFactory } from "./service/"

// in strict mode, mobx requires that all observable data members only be modified through explicit @action mutators
useStrict(true)

const root = document.getElementById("root")

const rootStore = new RootStore(DataServiceFactory.getDataService())

// TODO remove window rootStore reference
window["rootStore"] = rootStore

ReactDom.render(
    <Provider rootStore={rootStore}>
        <App />
    </Provider>,
    root
)
rootStore.init()
