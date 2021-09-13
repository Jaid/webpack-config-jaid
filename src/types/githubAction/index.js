import webpackMerge from "../../lib/webpackMerge.js"
import Node from "../node/index.js"

export default class extends Node {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetDefaultOptionsContext} context
   */
  getDefaultOptions() {
    const terserOptions = this.createTerserOptions({
      toplevel: true,
    })

    return {
      terserOptions,
      include: false,
      nodeExternals: false,
      outDir: "build",
      licenseFileName: false,
    }
  }

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfig() {
    const nodeConfig = super.getWebpackConfig()
    const config = {
      resolve: {
        mainFields: ["main", "module"],
      },
    }
    return webpackMerge(nodeConfig, config)
  }

}