import camelcase from "camelcase"

import WebpackConfigType from "../WebpackConfigType.js"

export default class extends WebpackConfigType {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetDefaultOptionsContext} context
   * @return {import("../index").WebpackConfigJaidOptions}
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
   * @param {string} pkgName
   * @return {string}
   */
  getLibraryName(pkgName) {
    return camelcase(pkgName)
  }

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig({pkg, options}) {
    /**
      * @type {import("webpack").Configuration}
    */
    const config = {}
    if (!options.esm) {
      config.output = {
        libraryTarget: "umd2",
        globalObject: "this",
      }
      if (pkg?.name) {
        config.output.library = this.getLibraryNameFromPkg(pkg)
      }
      return config
    }
    // Normally config.target shouldn't be hardcoded
    // Webpack can decide this one by itself using browserslist
    // But a missing feature currently disallows mixing web targets and node targets
    // TODO Remove or improve this hack later
    // See https://github.com/webpack/webpack/issues/11660#issuecomment-841625881
    return {
      target: "web",
      optimization: {
        // minimize: false,
      },
      experiments: {
        outputModule: true, // https://webpack.js.org/configuration/experiments/#experimentsoutputmodule
      },
      output: {
        module: true, // https://webpack.js.org/configuration/output/#outputmodule
        filename: "index.js", // https://webpack.js.org/configuration/output/#outputfilename
        library: {
          type: "module", // https://webpack.js.org/configuration/output/#librarytarget-module
        },
      },
    }
  }

}