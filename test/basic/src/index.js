import {isNumber} from "lodash"

export default (value1, value2) => {
  if (isNumber(value1) && isNumber(value2)) {
    return value1 + value2
  }
  throw new TypeError("I need some numbers!")
}