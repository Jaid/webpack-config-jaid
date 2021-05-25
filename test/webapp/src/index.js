/* eslint-disable no-undef */

import offlineRuntime from "@lcdp/offline-plugin/runtime"
import React from "react"
import ReactDom from "react-dom"
import {Provider} from "react-redux"
import {createStore} from "redux"

import App from "./App"
import reducer from "./reducer"

offlineRuntime.install()

const store = createStore(reducer)

const rootNode = document.createElement("div")
document.body.append(rootNode)

// jsx not enabled here
// const rootElement = <Provider store={store}>
//   <App/>
// </Provider>

const appElement = React.createElement(App)
const rootElement = React.createElement(Provider, {store}, appElement)

ReactDom.render(rootElement, rootNode)