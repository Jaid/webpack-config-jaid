import {pascalCase} from "pascal-case"

import UniversalLib from "../universalLib/index.js"

export default class extends UniversalLib {

  /**
   * @function
   * @param {Object} pkg
   * @return {string}
   */
  getLibraryNameFromPkg(pkg) {
    return pascalCase(pkg.name)
  }

}