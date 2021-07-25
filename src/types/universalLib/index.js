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
    // Normally config.target shouldn't be hardcoded
    // Webpack can decide this one by itself using browserslist
    // But a missing feature currently disallows mixing web targets and node targets
    // TODO Remove or improve this hack later
    // See https://github.com/webpack/webpack/issues/11660#issuecomment-841625881
    config.target = "web"
    return config
  }

}