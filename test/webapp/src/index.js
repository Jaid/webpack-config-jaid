/* eslint-disable no-unused-vars */
/* eslint-disable you-dont-need-lodash-underscore/trim */
/* eslint-disable no-undef */

import icon from "./perk.png"
import css from "./style.scss"

import innerHtml from "!raw-loader!./innerHtml.html"

require("@lcdp/offline-plugin/runtime").install()

window.icon = icon
document.body.innerHTML = innerHtml
const img = document.createElement("img")
img.src = window.icon.toString()
document.querySelector("body > div").append(img)
window.message = `This is a ${process.browser ? "browser" : "non-browser"} environment with user-agent ${navigator.userAgent}`
const main = document.querySelector("main>*")
main.classList.add(css.main)
main.innerText = window.message