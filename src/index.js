import path from "path"

import readPkg from "read-pkg"
import webpackMerge from "webpack-merge"
import appRootPath from "app-root-path"
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
// import LodashWebpackPlugin from "lodash-webpack-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import PublishimoWebpackPlugin from "publishimo-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import {isObject, isArray} from "lodash"

export default options => {
  options = {
    packageRoot: String(appRootPath),
    development: process.env.NODE_ENV !== "production",
    extra: null,
    extraProduction: null,
    extraDevelopment: null,
    type: "lib",
    include: false,
    publishimo: false,
    ...options,
  }

  options = {
    clean: !options.development,
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
    mode: options.development ? "development" : "production",
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
      config.plugins.push(new CleanWebpackPlugin(options.clean, {allowExternal: true}))
    } else if (options.clean === true) {
      config.plugins.push(new CleanWebpackPlugin([options.outDir], {allowExternal: true}))
    }
  }

  if (options.development) {
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
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
      chunks: true,
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

  if (pkg.dependencies) {
    config.externals = (context, request, callback) => { // eslint-disable-line promise/prefer-await-to-callbacks
      if (pkg.dependencies[request]) {
        return callback(null, `commonjs2 ${request}`) // eslint-disable-line promise/prefer-await-to-callbacks
      }
      callback() // eslint-disable-line promise/prefer-await-to-callbacks
    }
  }

  if (options.publishimo) {
    config.plugins.push(new PublishimoWebpackPlugin({
      autoMain: options.type === "cli" ? "bin" : true,
      ...options.publishimo,
    }))
  }

  if (options.include) {
    if (!Array.isArray(options.include)) {
      options.include = [options.include]
    }
    config.plugins.push(new CopyWebpackPlugin(options.include))
  }

  const extra = []

  if (options.extra) {
    extra.push(options.extra)
  }

  if (options.extraProduction && !options.development) {
    extra.push(options.extraProduction)
  }

  if (options.extraDevelopment && options.development) {
    extra.push(options.extraDevelopment)
  }

  if (extra.length) {
    return webpackMerge.smart(config, ...extra)
  } else {
    return config
  }
}