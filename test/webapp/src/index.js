/* eslint-disable no-undef */

// TODO Replace @lcdp/offline-plugin with workbox
// import offlineRuntime from "@lcdp/offline-plugin/runtime.js"
import React from "react"
import ReactDom from "react-dom"
import {Provider} from "react-redux"
import {createStore} from "redux"

import App from "./App.js"
import reducer from "./reducer.js"

// offlineRuntime.install()

const store = createStore(reducer)

const rootNode = document.querySelector("body>div")

// jsx not enabled here
// const rootElement = <Provider store={store}>
//   <App/>
// </Provider>

const appElement = React.createElement(App)
const rootElement = React.createElement(Provider, {store}, appElement)

ReactDom.render(rootElement, rootNode)