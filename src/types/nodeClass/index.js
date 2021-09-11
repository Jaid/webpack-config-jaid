import {pascalCase} from "pascal-case"

import NodeLib from "../../types/nodeLib/index.js"

export default class extends NodeLib {

  /**
   * @function
   * @param {Object} pkg
   * @return {string}
   */
  getLibraryNameFromPkg(pkg) {
    return pascalCase(pkg.name)
  }

}