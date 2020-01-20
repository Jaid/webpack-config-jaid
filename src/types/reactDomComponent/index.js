import webpackMerge from "webpack-merge"

import UniversalClass from "src/types/universalClass"

export default class extends UniversalClass {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfig(context) {
    const nodeConfig = super.getWebpackConfig(context)
    debugger
    /**
     * @type {import("webpack").Configuration}
     */
    const config = {
      target: "web",
    }
    return webpackMerge.smart(nodeConfig, config)
  }

}