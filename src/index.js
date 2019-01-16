import path from "path"

import readPkg from "read-pkg"
import webpackMerge from "webpack-merge"
import appRootPath from "app-root-path"
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
import LodashWebpackPlugin from "lodash-webpack-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import {isObject, isArray} from "lodash"

export default options => {
  options = {
    packageRoot: String(appRootPath),
    isDevelopment: true,
    extra: null,
    type: "lib",
    ...options,
  }

  options = {
    clean: !options.isDevelopment,
    outDir: path.join(options.packageRoot, "dist"),
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
          test: /\.ya?ml$/,
          loader: "yml-loader",
        },
      ],
    },
    plugins: [new FriendlyErrorsWebpackPlugin],
    output: {
      path: options.outDir,
      filename: "index.js",
    },
    optimization: {
      noEmitOnErrors: true,
    },
  }

  if (options.clean) {
    if (isObject(options.clean)) {
      config.plugins.push(new CleanWebpackPlugin([options.outDir], options.clean))
    } else if (isArray(options.clean)) {
      config.plugins.push(new CleanWebpackPlugin(options.clean[0], options.clean[1]))
    } else if (options.clean === true) {
      config.plugins.push(new CleanWebpackPlugin([options.outDir]))
    }
  }

  if (options.isDevelopment) {
    config.devtool = "inline-source-map"
    Object.assign(config.output, {
      auxiliaryComment: {
        root: "[Exposing Section] root",
        commonjs: "[Exposing Section] commonjs",
        commonjs2: "[Exposing Section] commonjs2",
        amd: "[Exposing Section] amd",
      },
    })
    config.stats = {
      all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
    }
  }

  if (options.type) {
    const typeProvider = require(`./types/${options.type}`)
    typeProvider({
      config,
      options,
      pkg,
      fromPackage,
    })
  }

  if (options.extra) {
    return webpackMerge.smart(config, options.extra)
  } else {
    return config
  }
}