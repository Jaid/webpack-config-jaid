import camelcase from "camelcase"

import WebpackConfigType from "../WebpackConfigType"

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
      nodeExternals: false,
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
   * @param {GetDefaultOptionsContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig({pkg}) {
    const config = {
      output: {
        libraryTarget: "umd2",
        globalObject: "this",
      },
    }
    if (pkg?.name) {
      config.output.library = this.getLibraryNameFromPkg(pkg)
    }
    return config
  }

}