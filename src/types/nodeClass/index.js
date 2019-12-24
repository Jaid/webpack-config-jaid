import {pascalCase} from "pascal-case"

import NodeLib from "src/types/nodeLib"

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