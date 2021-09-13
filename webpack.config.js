import fs from "node:fs"
import path from "node:path"
import {fileURLToPath} from "node:url"

import {CleanWebpackPlugin} from "clean-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"

const rootFolder = path.dirname(fileURLToPath(import.meta.url))
const pkgFile = path.join(rootFolder, "package.json")
const pkg = JSON.parse(fs.readFileSync(pkgFile))
const entryFolder = path.join(rootFolder, "src")

const env = process.env.NODE_ENV || "development"
const isDevelopment = env !== "production"

/**
 * @type {import("webpack").Configuration}
 */
const baseConfig = {
  target: "node16",
  context: rootFolder,
  mode: isDevelopment ? "development" : "production",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: entryFolder,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "license.txt",
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  output: {
    path: path.join(rootFolder, "dist", "package", env),
    module: true, // https://webpack.js.org/configuration/output/#outputmodule
    // filename: "index.mjs", // https://webpack.js.org/configuration/output/#outputfilename
    // library: {
    // type: "module", // https://webpack.js.org/configuration/output/#librarytarget-module
    // },
  },
  optimization: {
    minimize: false,
  },
  experiments: {
    outputModule: true, // https://webpack.js.org/configuration/experiments/#experimentsoutputmodule
  },
  externals: ({request}, callback) => { // eslint-disable-line promise/prefer-await-to-callbacks
    if (pkg.dependencies?.[request] || pkg.peerDependencies?.[request]) {
      return callback(null, `module ${request}`) // eslint-disable-line promise/prefer-await-to-callbacks
    }
    callback() // eslint-disable-line promise/prefer-await-to-callbacks
  },
}

export default baseConfig