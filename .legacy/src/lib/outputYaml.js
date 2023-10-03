import fs from "fs-extra"
import jsYaml from "js-yaml"
import {isFunction} from "lodash-es"

const replacer = value => {
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
}

export default (file, content) => {
  const text = jsYaml.dump(content, {replacer})
  fs.outputFileSync(file, text)
}