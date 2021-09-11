import webpackMerge from "lib/webpackMerge.js"

import Node from "src/types/node/index.js"

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
      hashbang: "/usr/bin/env node",
      publishimo: true,
    }
  }

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfig() {
    const nodeConfig = super.getWebpackConfig()
    const config = {
      output: {
        filename: "cli.js",
      },
    }
    return webpackMerge(nodeConfig, config)
  }

}