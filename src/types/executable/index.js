import webpackMerge from "../../esm/webpack-merge.js"

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
      hashbang: "/usr/bin/env node",
      publishimo: true,
    }
  }

}