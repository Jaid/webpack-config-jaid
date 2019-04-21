import {trim} from "lodash"
import css from "./style.scss"

document.querySelector("body > div").innerText = trim(" 123 ")
window.message =  `This is a ${process.browser ? "browser" : "non-browser"} environment`