import webpackMerge from "../../lib/esm/webpack-merge.js"
import Node from "../node/index.js"

export default class extends Node {

  /**
   * @function
   * @param {import("../WebpackConfigType.js").GetDefaultOptionsContext} context
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
   * @param {import("../WebpackConfigType.js").GetWebpackConfigContext} context
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