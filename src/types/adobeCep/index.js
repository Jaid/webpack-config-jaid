import camelcase from "camelcase"
import CepPlugin from "cep-webpack-plugin"

import webpackMerge from "../../lib/webpackMerge.js"
import Html from "../html/index.js"

export default class extends Html {

  /**
   * @return {string}
   */
  getIdentifier() {
    let identifier = ""
    if (this.pkg.author?.name) {
      identifier += camelcase(this.pkg.author.name)
      identifier += "."
    }
    identifier += camelcase(this.pkg.name)
    return identifier
  }

  /**
   * @param {import("src/types/WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig(context) {
    const parentConfig = super.getWebpackConfig(context)
    const identifier = this.getIdentifier()
    const webpackConfig = {
      plugins: [
        new CepPlugin({
          identifier,
          title: this.title,
          version: this.pkg.version,
          ...this.options.cepOptions || {},
        }),
      ],
    }
    return webpackMerge(parentConfig, webpackConfig)
  }

}