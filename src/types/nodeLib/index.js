import webpackMerge from "lib/esm/webpack-merge.js"
import Node from "../node/index.js"

export default class extends Node {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetDefaultOptionsContext} context
   */
  getDefaultOptions() {
    const terserOptions = this.createTerserOptions({
      toplevel: true,
      module: true,
    })

    return {
      terserOptions,
      publishimo: true,
    }
  }

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfig({pkg}) {
    const nodeConfig = super.getWebpackConfig()
    const config = {
      output: {
        library: {
          type: "module", // https://webpack.js.org/configuration/output/#librarytarget-module
        },
      },
    }
    return webpackMerge(nodeConfig, config)
  }

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfigCommonjs({pkg}) {
    const nodeConfig = super.getWebpackConfig()
    const config = {
      output: {
        libraryTarget: "umd2",
      },
    }
    if (pkg?.name) {
      config.output.library = {
        root: this.getLibraryNameFromPkg(pkg),
        amd: pkg.name,
        commonjs: pkg.name,
      }
    }
    return webpackMerge(nodeConfig, config)
  }

}