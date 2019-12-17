import path from "path"
import fs from "fs"

import readPkg from "read-pkg"
import webpackMerge from "webpack-merge"
import appRootPath from "app-root-path"
import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
import FilterWarningsPlugin from "webpack-filter-warnings-plugin"
import {CleanWebpackPlugin} from "clean-webpack-plugin"
import PublishimoWebpackPlugin from "publishimo-webpack-plugin"
import JsdocTsdWebpackPlugin from "jsdoc-tsd-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import {isObject, isArray, isString, isFunction, sortBy} from "lodash"
import fss from "@absolunet/fss"
import json5 from "json5"
import webpack from "webpack"
import ensureStart from "ensure-start"
import terser from "terser"
import TerserPlugin from "terser-webpack-plugin"
import {LicenseWebpackPlugin} from "license-webpack-plugin"
import immer from "immer"
import types from "./types"
import hasContent from "has-content"
import cleanForYaml from "lib/cleanForYaml"
const DeepScopePlugin = require("webpack-deep-scope-plugin").default
const debug = require("debug")(_PKG_NAME)

const env = process.env.NODE_ENV.toLowerCase?.() || "development"

export default (options={}) => {
  debug(`NODE_ENV: ${env}`)
  debug(`Options: ${options |> json5.stringify}`)

  let pkg
  try {
    pkg = readPkg.sync({
      cwd: options.packageRoot || String(appRootPath),
      normalize: true,
    })
    debug(`Pkg data: ${pkg |> json5.stringify}`)
  } catch {
    pkg = {}
  }

  if (pkg.webpackConfigJaid) {
    debug("Found webpackConfigJaid field in pkg: %j", pkg.webpackConfigJaid)
    if (pkg.webpackConfigJaid |> isString) {
      options = {
        type: pkg.webpackConfigJaid,
        ...options,
      }
    } else {
      options = {
        ...pkg.webpackConfigJaid,
        ...options,
      }
    }
  }

  /**
   * @type {import("./index").TypeProvider}
   */
  let typeProvider
  let typeDefaultOptions
  if (options.type) {
    if (isString(options.type)) {
      typeProvider = types[options.type]
    } else {
      typeProvider = options.type
    }
    if (!typeProvider) {
      throw new TypeError(`Invalid webpack-config-jaid type "${options.type}", returned ${typeProvider} (Available types: ${Object.keys(types).join(", ")})`)
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
    sourceFolder: "src",
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
    licenseFileName: "thirdPartyLicenses.txt",
    terserOptions: {
      compress: {
        passes: 5,
      },
    },
    terserPluginOptions: {
      sourceMap: true,
      cache: false,
      parallel: false,
    },
    publishimo: false,
    documentation: false,
    nodeExternals: true,
    configOutput: false,
    title: pkg.title || null,
    robots: false,
    icon: null,
    domain: pkg.domain || null,
    includeMonacoEditor: false,
    createCssFile: true,
    optimizeCss: true,
    hashbang: null,
    backgroundColor: "13061b",
    themeColor: "a12fdc",
    excludeLocale: true,
    appDescription: null,
    twitterSiteHandle: null,
    twitterAuthorHandle: null,
    locale: "en-US",
    sitemap: false,
    googleAnalyticsOnlyInProduction: true,
    friendlyErrors: false,
    ...typeDefaultOptions || {},
    ...options,
  }

  const fromRoot = (...directive) => path.resolve(options.packageRoot, ...directive)

  // output.path of Webpack config must be an absolute path, forcing here
  if (options.outDir && !path.isAbsolute(options.outDir)) {
    const absoluteOutDir = fromRoot(options.outDir)
    debug(`Rewriting outDir ${options.outDir} to ${absoluteOutDir}`)
    options.outDir = fromRoot(options.outDir)
  }

  options = {
    clean: !options.development,
    outDir: fromRoot("dist", "package", env),
    ...options,
  }

  if (typeProvider?.processOptions |> isFunction) {
    typeProvider.processOptions(options, {
      env,
      fromRoot,
    })
  }

  const entryFolder = options.sourceFolder ? fromRoot(options.sourceFolder) : options.packageRoot

  let entry
  const specificEntry = path.join(entryFolder, `index.${env}.js`)
  if (fs.existsSync(specificEntry)) {
    entry = specificEntry
    debug("Using environment-specific entry %s", specificEntry)
  } else {
    const defaultEntry = entryFolder
    entry = defaultEntry
    debug("Could not find entry %s, using %s instead", specificEntry, defaultEntry)
  }

  /**
   * @type {import("webpack").Configuration}
   */
  const config = {
    entry,
    context: path.resolve(options.packageRoot),
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".yml"],
    },
    mode: options.development ? "development" : "production",
    devtool: options.development ? "inline-source-map" : "source-map",
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          oneOf: [
            {
              resourceQuery: /\?aot/,
              use: [
                "aot-loader",
                "babel-loader",
              ],
            },
            {
              include: entryFolder,
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.ya?ml$/,
          loader: "yml-loader",
        },
        {
          test: /\.lines$/,
          loader: "lines-loader",
        },
        {
          test: /\.rlines$/,
          loader: "lines-loader",
          options: {
            sort: true,
            random: true,
          },
        },
        {
          test: /\.txt$/,
          loader: "raw-loader",
        },
        {
          test: /\.(hbs|handlebars)$/,
          oneOf: [
            {
              resourceQuery: /\?html/,
              loader: "handlebars-loader",
            },
            {
              loader: "handlebars-loader",
              options: {
                precompileOptions: {
                  noEscape: true,
                },
              },
            },
          ]
          ,
        },
      ],
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: options.development,
        minimize: !options.development,
      }),
      new FilterWarningsPlugin({
        exclude: [
          /^Critical dependency: the request of a dependency is an expression/,
          /^Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/
        ]
      })
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
    performance: {
      maxEntrypointSize: 4 * 1000 * 1000, // 4 MB
      maxAssetSize: 4 * 1000 * 1000, // 4 MB
    },
  }

  if (options.development) {
    config.plugins.push(new DeepScopePlugin)
  }

  if (options.friendlyErrors && env !== "test") {
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
    if (options.nodeExternals === false) {
      publishimoConfig.excludeFields = [
        "dependencies",
        "optionalDependencies",
        "peerDependencies",
      ]
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

  if (isString(options.hashbang)) {
    config.plugins.push(new webpack.BannerPlugin({
      banner: ensureStart(options.hashbang.trim(), "#!"),
      raw: true,
    }))
  }

  if (!options.development) {
    if (options.terserOptions === false) {
      debug("terserOptions is false, skipping minification")
      config.optimization.minimize = false
    } else {
      debug("terserOptions: %o", options.terserOptions)
      config.optimization.minimizer = [
        new TerserPlugin({
          minify: file => terser.minify(file, options.terserOptions),
          ...options.terserPluginOptions,
        }),
      ]
    }
  }

  if (!options.development && options.licenseFileName) {
    config.plugins.push(new LicenseWebpackPlugin({
      stats: {
        warnings: false,
        errors: true,
      },
      outputFilename: options.licenseFileName,
      renderLicenses: licenses => licenses
      |> #.map(license => license.name ? license : immer(draft => {
        draft.name = _PKG_NAME || "Unknown package"
      }))
      |> sortBy(#, ({name}) => name)
      |> #.map(license => {
        const text = license.licenseText?.trim() || "No license defined."
        const versionString = license.packageJson?.version ? ` ${license.packageJson.version}` : ""
        return `=== ${license.name}${versionString} ===\n\n${text}`
      })
      |> #.join("\n\n"),
    }))
  }

  if (options.excludeLocale) {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
  }

  debug(`Base config: ${config |> json5.stringify}`)

  const extra = []

  if (typeProvider?.webpackConfig |> isFunction) {
    const typeWebpackConfig = typeProvider.webpackConfig({
      pkg,
      env,
      options,
      fromRoot,
      entryFolder,
      initialWebpackConfig: config,
    })
    extra.push(typeWebpackConfig)
  }

  if (typeProvider?.defines |> isObject) {
    config.plugins.push(new webpack.DefinePlugin(typeProvider.defines))
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
    const outputFile = options.configOutput === true ? fromRoot("dist", "webpack-config-jaid", "config.yml") : path.resolve(options.configOutput)
    fss.outputYaml(outputFile, cleanForYaml(mergedConfig))
    const pluginsOutputFile = path.resolve(outputFile, "..", "plugins.yml")
    const plugins = []
    for (const plugin of mergedConfig.plugins) {
      const pluginName = plugin.constructor?.name || "Untitled plugin"
      if (hasContent(plugin.options)) {
        plugins.push([pluginName, plugin.options])
      } else {
        plugins.push(pluginName)
      }
    }
    fss.outputYaml(pluginsOutputFile, cleanForYaml(plugins))
  }

  debug(`Final Webpack config: ${mergedConfig |> json5.stringify}`)

  return mergedConfig
}