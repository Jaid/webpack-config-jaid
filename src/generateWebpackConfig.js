import path from "path"

import readPkg from "read-pkg"
import webpackMerge from "webpack-merge"
import appRootPath from "app-root-path"
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import PublishimoWebpackPlugin from "publishimo-webpack-plugin"
import JsdocTsdWebpackPlugin from "jsdoc-tsd-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import {isObject, isArray} from "lodash"

export default options => {
  options = {
    packageRoot: String(appRootPath),
    development: process.env.NODE_ENV !== "production",
    extra: null,
    extraProduction: null,
    extraDevelopment: null,
    include: [
      "readme.*",
      "README.*",
      "license.*",
      "LICENSE.*",
    ],
    publishimo: false,
    documentation: false,
    nodeExternals: true,
    ...options,
  }

  const fromPackage = (...directive) => path.resolve(options.packageRoot, ...directive)

  options = {
    clean: !options.development,
    outDir: fromPackage("dist", "package", process.env.NODE_ENV || "development"),
    ...options,
  }

  let pkg
  try {
    pkg = readPkg.sync({
      cwd: options.packageRoot,
    })
  } catch {
    pkg = {}
  }

  const config = {
    context: path.resolve(options.packageRoot),
    entry: fromPackage("src"),
    resolve: {
      extensions: [".js", ".json", ".yml"],
      alias: {
        lib: fromPackage("src/lib"),
      },
    },
    mode: options.development ? "development" : "production",
    devtool: options.development ? "inline-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          enforce: "post",
          resourceQuery: /\?aot$/,
          loader: "aot-loader",
        },
        {
          test: /\.jsx?$/,
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
    const {default: typeProvider} = require(`./types/${options.type}`)
    if (typeof typeProvider !== "function") {
      throw new TypeError(`Invalid webpack-config-jaid type "${options.type}", returned ${typeProvider}`)
    }
    typeProvider(config, {
      options,
      pkg,
      fromPackage,
    })
  }

  if (options.nodeExternals && pkg.dependencies) {
    config.externals = (context, request, callback) => { // eslint-disable-line promise/prefer-await-to-callbacks
      if (pkg.dependencies[request]) {
        return callback(null, `commonjs2 ${request}`) // eslint-disable-line promise/prefer-await-to-callbacks
      }
      callback() // eslint-disable-line promise/prefer-await-to-callbacks
    }
  }

  if (options.documentation) {
    const plugin = options.documentation === true ? new JsdocTsdWebpackPlugin : new JsdocTsdWebpackPlugin(options.documentation)
    config.plugins.push(plugin)
    if (options.clean) {
      const htmlJsdocPath = path.join(path.dirname(options.outDir), "homepage")
      const tsdJsdocPath = path.join(path.dirname(options.outDir), "tsd")
      config.plugins.push(new CleanWebpackPlugin([htmlJsdocPath, tsdJsdocPath], {allowExternal: true}))
    }
  }

  if (options.publishimo) {
    const publishimoConfig = {
      autoMain: options.type === "cli" ? "bin" : true,
      autoTypes: Boolean(options.documentation),
    }
    if (typeof options.publishimo === "object") {
      Object.assign(publishimoConfig, options.publishimo)
    }
    config.plugins.push(new PublishimoWebpackPlugin(publishimoConfig))
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