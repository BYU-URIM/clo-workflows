import * as React from "react"
import * as ReactDom from "react-dom"
import { useStrict } from "mobx"
import { BrowserRouter, Router } from "react-router-dom"
import { App } from "./layout/App"
import { Provider } from "mobx-react"
import { RootStore } from "./store/RootStore"
import { AsyncService } from "./service/AsyncService"
import { DataAccessFactory } from "./dataAccess/DataAccessFactory"

// in strict mode, mobx requires that all observable data members only be modified through explicit @action mutators
useStrict(true)

const root = document.getElementById("root")

const rootStore = new RootStore(new AsyncService(DataAccessFactory.getDao()))

rootStore.init().then(() => {
    ReactDom.render(
        <Provider rootStore={rootStore}>
            <App />
        </Provider>
    , root)
})
