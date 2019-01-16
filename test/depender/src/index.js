import validateNpmPackageName from "validate-npm-package-name"

import pkg from "../package"

if (validateNpmPackageName(pkg.name).validForNewPackages) {
  console.log("My name is valid!")
}