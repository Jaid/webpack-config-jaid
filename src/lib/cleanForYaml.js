import deepMap from "deep-map"
import {isFunction} from "lodash"

export default object => deepMap(object, value => {
  if (value === undefined) {
    return "(undefined)"
  }
  if (isFunction(value)) {
    return "(function)"
  }
  if (value instanceof RegExp) {
    return value.toString()
  }
  return value
})