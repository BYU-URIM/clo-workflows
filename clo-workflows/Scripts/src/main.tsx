import * as React from "react"
import * as ReactDom from "react-dom"
import { useStrict } from "mobx"
import { BrowserRouter, Router } from "react-router-dom"
import { App } from "./layout/App"

// in strict mode, mobx requires that all observable data members only be modified through explicit @action mutators
useStrict(true)

const root = document.getElementById("root")
ReactDom.render(
    <App />
, root)
