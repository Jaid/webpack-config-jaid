import webpackMerge from "lib/esm/webpack-merge.js"

import UniversalClass from "../universalClass/index.js"

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