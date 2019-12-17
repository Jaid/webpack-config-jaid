import React from "react"
import ReactDom from "react-dom"
import {Provider} from "react-redux"
import {applyMiddleware, createStore} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import {createLogger} from "redux-logger"
import thunk from "redux-thunk"

import HotApp from "components/HotApp"

import reducer from "./redux/reducer"

const logger = createLogger({
  level: "info",
  collapsed: true,
})
const store = createStore(reducer, applyMiddleware(thunk, logger) |> composeWithDevTools)
if (module.hot) {
  module.hot.accept("./redux/reducer", () => store.replaceReducer(require("./redux/reducer").default))
}

const rootNode = document.createElement("div")
document.body.append(rootNode)

ReactDom.render(<Provider store={store}>
  <HotApp/>
</Provider>, rootNode)