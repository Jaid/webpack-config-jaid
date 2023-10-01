import "./style.scss"

import {trim} from "lodash-es"

import icon from "./perk.png"

window.icon = icon

document.body.innerHTML = "<div/>"
const img = document.createElement("img")
img.src = icon.toString()
document.querySelector("body > div").append(img)
window.message = `This is a ${process.browser ? "browser" : "non-browser"} environment`