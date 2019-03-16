import path from "path"
import fs from "fs"

import readPkg from "read-pkg"
import webpackMerge from "webpack-merge"
import appRootPath from "app-root-path"
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import PublishimoWebpackPlugin from "publishimo-webpack-plugin"
import JsdocTsdWebpackPlugin from "jsdoc-tsd-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import {isObject, isArray} from "lodash"
import fss from "@absolunet/fss"
import json5 from "json5"
import webpack from "webpack"

const debug = require("debug")("webpack-config-jaid")

const env = (process.env.NODE_ENV || "development").toLowerCase()

export default options => {
  debug(`NODE_ENV: ${env}`)
  debug(`Options: ${options |> json5.stringify}`)

  let typeProvider
  let typeDefaultOptions
  if (options.type) {
    try {
      typeProvider = require(`./types/${options.type}`)
    } catch (error) {
      if (typeof typeProvider !== "function") {
        throw new TypeError(`Invalid webpack-config-jaid type "${options.type}", returned ${typeProvider}`, error)
      }
    }
    if (typeof typeProvider.defaultOptions === "function") {
      typeDefaultOptions = typeProvider.defaultOptions({
        env,
        options,
        webpack,
      })
      debug(`Including default options from ${options.type}: ${typeDefaultOptions |> json5.stringify}`)
    }
  }

  options = {
    packageRoot: String(appRootPath),
    development: env !== "production",
    extra: null,
    extraProduction: null,
    extraDevelopment: null,
    type: null,
    include: [
      "readme.*",
      "README.*",
      "license.*",
      "LICENSE.*",
    ],
    publishimo: false,
    documentation: false,
    nodeExternals: true,
    configOutput: false,
    title: null,
    robots: false,
    icon: null,
    domain: null,
    includeMonacoEditor: false,
    ...(typeDefaultOptions || {}),
    ...options,
  }

  const fromRoot = (...directive) => path.resolve(options.packageRoot, ...directive)

  options = {
    clean: !options.development,
    outDir: fromRoot("dist", "package", env),
    ...options,
  }

  let pkg
  try {
    pkg = readPkg.sync({
      cwd: options.packageRoot,
    })
    debug(`Pkg data: ${pkg |> json5.stringify}`)
  } catch {
    pkg = {}
  }

  let entry
  const specificEntry = fromRoot("src", `index.${env}.js`)
  if (fs.existsSync(specificEntry)) {
    entry = specificEntry
    debug("Using environment-specific entry %s", specificEntry)
  } else {
    const defaultEntry = fromRoot("src")
    entry = defaultEntry
    debug("Couldn not find entry %s, using %s instead", specificEntry, defaultEntry)
  }

  const config = {
    entry,
    context: path.resolve(options.packageRoot),
    resolve: {
      extensions: [".js", ".json", ".yml"],
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
        {
          test: /\.txt$/,
          loader: "raw-loader",
        },
      ],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: options.development,
        minimize: !options.development,
      }),
    ],
    output: {
      path: options.outDir,
      filename: "index.js",
    },
    optimization: {
      noEmitOnErrors: true,
    },
    stats: {
      all: false,
      assets: true,
      assetsSort: "!size",
      excludeAssets: /.(map|d.ts)$/,
      colors: true,
      warnings: true,
      errors: true,
      errorDetails: true,
    },
  }

  if (env !== "test") {
    config.plugins.push(new FriendlyErrorsWebpackPlugin)
  }

  if (options.clean) {
    if (isObject(options.clean)) {
      config.plugins.push(new CleanWebpackPlugin(options.clean))
    } else if (isArray(options.clean)) {
      config.plugins.push(new CleanWebpackPlugin({
        verbose: false,
        cleanOnceBeforeBuildPatterns: options.clean,
      }))
    } else if (options.clean === true) {
      config.plugins.push(new CleanWebpackPlugin({
        verbose: false,
        cleanOnceBeforeBuildPatterns: [options.outDir],
      }))
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
      config.plugins.push(new CleanWebpackPlugin({
        verbose: false,
        cleanOnceBeforeBuildPatterns: [htmlJsdocPath, tsdJsdocPath],
      }))
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

  debug(`Base config: ${config |> json5.stringify}`)

  const extra = []

  if (typeof typeProvider?.webpackConfig === "function") {
    const typeWebpackConfig = typeProvider.webpackConfig({
      pkg,
      env,
      options,
      fromRoot,
      initialWebpackConfig: config,
    })
    extra.push(typeWebpackConfig)
  }

  if (options.extra) {
    extra.push(options.extra)
  }

  if (options.extraProduction && !options.development) {
    extra.push(options.extraProduction)
  }

  if (options.extraDevelopment && options.development) {
    extra.push(options.extraDevelopment)
  }

  extra.forEach((extraEntry, index) => {
    debug(`Extra config #${index + 1}: ${extraEntry |> json5.stringify}`)
  })

  const mergedConfig = extra.length ? webpackMerge.smart(config, ...extra) : config

  if (options.configOutput) {
    const outputFile = options.configOutput === true ? path.resolve(options.outDir, "webpackConfig.json5") : path.resolve(options.configOutput)
    fss.outputJson5(outputFile, mergedConfig, {space: 2})
  }

  debug(`Final Webpack config: ${mergedConfig |> json5.stringify}`)

  return mergedConfig
}