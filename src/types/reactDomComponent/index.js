import webpackMerge from "../../lib/webpackMerge.js"

import UniversalClass from "../../types/universalClass/index.js"

export default class extends UniversalClass {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfig(context) {
    const nodeConfig = super.getWebpackConfig(context)
    /**
     * @type {import("webpack").Configuration}
     */
    const config = {
      target: "web",
    }
    return webpackMerge(nodeConfig, config)
  }

}