import webpack from "webpack"

import webpackMerge from "../../lib/esm/webpack-merge.js"
import WebpackConfigType from "../WebpackConfigType.js"

/**
 * @class
 * @extends WebpackConfigType
 */
export default class extends WebpackConfigType {

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
    }
  }

  /**
   * @function
   * @param {import("src/types/WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig(context) {
    const parentConfig = super.getWebpackConfig(context)
    const nodeConfig = {
      target: "node18",
      optimization: {
        nodeEnv: false,
      },
      node: {
        __dirname: false,
        __filename: false,
      },
      module: {
        rules: [
          {
            test: /\.(png|jpg|jpeg|webp|gif|svg|woff|woff2|ttf|eot|otf|mp4|flv|webm|mp3|flac|ogg|m4a|aac)$/,
            use: "buffer-loader",
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          "process.browser": false,
        }),
      ],
    }
    return webpackMerge(nodeConfig, parentConfig)
  }

}