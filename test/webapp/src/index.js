/* eslint-disable no-unused-vars */
/* eslint-disable you-dont-need-lodash-underscore/trim */
/* eslint-disable no-undef */

import {trim} from "lodash"

import icon from "./perk.png?responsive"
import css from "./style.scss"

require("offline-plugin/runtime").install()

window.icon = icon

document.body.innerHTML = "<div/>"
const img = document.createElement("img")
img.src = icon.toString()
document.querySelector("body > div").append(img)
window.message = `This is a ${process.browser ? "browser" : "non-browser"} environment`