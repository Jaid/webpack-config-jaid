import {isNumber} from "lodash"

export default (value1, value2, mode = "add") => {
  if (isNumber(value1) && isNumber(value2)) {
    if (mode === "add") {
      return value1 + value2
    }
    if (mode === "multiply") {
      return value1 * value2
    }
    throw new Error("Unkown arithmetic mode")
  }
  throw new TypeError("I need some numbers!")
}