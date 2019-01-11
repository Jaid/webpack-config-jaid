import path from "path"

import readPkg from "read-pkg"
import webpackMerge from "webpack-merge"
import appRootPath from "app-root-path"
import {isString} from "lodash"
import {BannerPlugin} from "webpack"

import Credits from "./Credits"

export default options => {
  options = {
    packageRoot: String(appRootPath),
    lib: false,
    isDevelopment: true,
    extra: null,
    ...options,
  }

  const fromPackage = directive => path.resolve(options.packageRoot, directive)
  const pkg = readPkg.sync({
    cwd: options.packageRoot,
  })

  const config = {
    target: "node",
    context: options.packageRoot,
    resolve: {
      extensions: [".js", ".json", ".yml"],
    },
    mode: options.isDevelopment ? "development" : "production",
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: "post",
          resourceQuery: /\?aot$/,
          loader: "aot-loader",
        },
        {
          test: /\.js$/,
          exclude: /node_modules\//,
          loader: "babel-loader",
        },
        {
          test: /\.yma?l$/,
          loader: "yml-loader",
        },
      ],
    },
    plugins: [
      new BannerPlugin({
        banner: String(new Credits(pkg)),
        entryOnly: true,
      }),
    ],
    output: {
      filename: "index.js",
    },
  }

  if (pkg.dependencies) {
    config.externals = Object.keys(pkg.dependencies)
  }

  if (options.lib === true) {
    Object.assign(config.output, {
      ...config.output,
      library: pkg.name,
      libraryTarget: "umd",
      umdNamedDefine: true,
    })
  } else if (isString(options.lib)) {
    Object.assign(config.output, {
      library: options.lib,
      libraryTarget: "umd",
      umdNamedDefine: true,
    })
  }

  if (options.extra) {
    return webpackMerge.smart(config, options.extra)
  } else {
    return config
  }
}