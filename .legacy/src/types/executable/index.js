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
      hashbang: "/usr/bin/env node",
      publishimo: true,
    }
  }

}