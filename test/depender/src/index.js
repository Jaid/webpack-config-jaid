import validateNpmPackageName from "validate-npm-package-name"
import {isEqual} from "lodash"

import pkg from "../package"

if (isEqual(validateNpmPackageName(pkg.name).validForNewPackages, true)) {
  console.log("My name is valid!")
} else {
  console.log(`My name "${pkg.name}" is invalid. :(`)
}