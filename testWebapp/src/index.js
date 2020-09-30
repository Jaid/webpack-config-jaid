import React from "react"
import ReactDom from "react-dom"
import {Provider} from "react-redux"

import App from "components/App"

import store from "src/redux/productionStore"

require("offline-plugin/runtime").install()

const rootNode = document.querySelector("body > div")

ReactDom.render(<Provider store={store}>
  <App/>
</Provider>, rootNode)