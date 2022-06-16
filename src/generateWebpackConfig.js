import path from "node:path"

import appRootPath from "app-root-path"
import {CleanWebpackPlugin} from "clean-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import createDebug from "debug"
import ensureArray from "ensure-array"
import fsExtra from "fs-extra"
import {LicenseWebpackPlugin} from "license-webpack-plugin"
import {isObject, isString} from "lodash-es"
import TerserPlugin from "terser-webpack-plugin"
import webpack from "webpack"

import ensureStart from "./lib/esm/ensure-start.js"
import hasContent from "./lib/esm/has-content.js"
import JsdocTsdWebpackPlugin from "./lib/esm/jsdoc-tsd-webpack-plugin.js"
import PkgBannerPlugin from "./lib/esm/pkg-banner-webpack-plugin.js"
import PublishimoWebpackPlugin from "./lib/esm/publishimo-webpack-plugin.js"
import webpackMerge from "./lib/esm/webpack-merge.js"
import outputYaml from "./lib/outputYaml.js"
import renderLicenses from "./lib/renderLicenses.js"
import types from "./types/index.js"

const debug = createDebug(process.env.REPLACE_PKG_NAME)

const env = process.env.NODE_ENV?.toLowerCase?.() || "development"

/**
 * @param {Object} [pkg]
 * @param {import("./index.js").WebpackConfigJaidOptions} [options]
 * @param {string} [subPackage]
 */
export default (pkg = {}, options = {}, subPackage) => {
  debug("NODE_ENV: %s", env)

  debug("Passed options: %o", options)

  if (pkg.webpackConfigJaid) {
    debug("Found webpackConfigJaid field in pkg: %s", pkg.webpackConfigJaid)
    if (isString(pkg.webpackConfigJaid)) {
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
   * @type {import("./types/WebpackConfigType").default}
   */
  let typeProvider
  let typeDefaultOptions
  if (!options.type) {
    throw new Error("options.type not given for webpack-config-jaid")
  }

  if (isString(options.type)) {
    const typeClass = types[options.type]
    if (!typeClass) {
      throw new TypeError(`Invalid webpack-config-jaid type "${options.type}", returned ${typeClass} (Available types: ${Object.keys(types).join(", ")})`)
    }
    typeProvider = new typeClass
  } else {
    typeProvider = options.type
  }
  typeProvider.pkg = pkg
  typeDefaultOptions = typeProvider.getDefaultOptions({
    env,
    options,
    webpack,
  })
  if (hasContent(typeDefaultOptions)) {
    debug("Including default options from %s: %o", options.type, typeDefaultOptions)
  }

  options = {
    packageRoot: String(appRootPath),
    sourceFolder: subPackage ? path.join("src", subPackage, "src") : "src",
    development: env !== "production",
    extra: null,
    extraProduction: null,
    extraDevelopment: null,
    type: null,
    licenseFileName: "thirdPartyLicenses.txt",
    terserOptions: {
      compress: {
        passes: 5,
      },
    },
    terserPluginOptions: {
      extractComments: false,
    },
    publishimo: false,
    documentation: false,
    nodeExternals: "packageRegex",
    configOutput: Boolean(process.env.debugWebpack),
    title: pkg.title || null,
    robots: false,
    icon: null,
    domain: pkg.domain || null,
    createCssFile: true,
    optimizeCss: true,
    hashbang: null,
    backgroundColor: "000000",
    themeColor: "04AAE3",
    excludeLocale: true,
    appDescription: null,
    twitterSiteHandle: null,
    twitterAuthorHandle: null,
    locale: "en-US",
    sitemap: false,
    googleAnalyticsOnlyInProduction: true,
    offline: false,
    pwa: false,
    browserSync: process.env.browserSync,
    ...typeDefaultOptions,
    ...options,
  }

  const fromRoot = (...directive) => path.resolve(options.packageRoot, ...directive)

  // output.path of Webpack config must be an absolute path, forcing here
  if (options.outDir && !path.isAbsolute(options.outDir)) {
    const absoluteOutDir = fromRoot(options.outDir)
    debug("Rewriting outDir %s to %s", options.outDir, absoluteOutDir)
    options.outDir = fromRoot(options.outDir)
  }

  /**
   * @type {import("./index.js").WebpackConfigJaidOptions}
   */
  options = {
    clean: !options.development,
    banner: !options.development,
    outDir: subPackage ? fromRoot("dist", "sub-package", subPackage, env) : fromRoot("dist", "package", env),
    include: options.development ? false : [
      "readme.*",
      "license.*",
    ],
    ...options,
  }

  typeProvider.processOptions(options, {
    env,
    fromRoot,
  })

  typeProvider.options = options

  const entryFolder = options.sourceFolder ? fromRoot(options.sourceFolder) : options.packageRoot

  let entryPath
  const specificEntry = path.join(entryFolder, `index.${env}.js`)
  if (fsExtra.pathExistsSync(specificEntry)) {
    entryPath = specificEntry
    debug("Using environment-specific entry %s", specificEntry)
  } else {
    const defaultEntry = entryFolder
    entryPath = path.join(defaultEntry, "index.js")
    debug("Could not find entry %s, using %s instead", specificEntry, entryPath)
  }

  /**
   * @type {import("webpack").Configuration}
   */
  const config = {
    name: subPackage ?? "main",
    entry: {
      index: entryPath,
    },
    context: path.resolve(options.packageRoot),
    mode: options.development ? "development" : "production",
    devtool: "source-map",
    optimization: {},
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          oneOf: [
            // TODO aot-loader is only for CommonJS, because it's using package require-from-string
            // Need to find (or create) an own loader using module-from-string
            // {
            //   resourceQuery: /\?aot$/,
            //   use: [
            //     "aot-loader",
            //     "babel-loader",
            //   ],
            // },
            {
              include: entryFolder,
              loader: "babel-loader",
            },
          ],
        },
        {
          test: /\.(yaml|yml)$/,
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
          type: "asset/source",
        },
        {
          resourceQuery: /\?raw$/,
          type: "asset/source",
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
          ],
        },
      ],
      parser: {
        javascript: {
          importMeta: true,
          importMetaContext: true,
        },
      },
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: options.development,
        minimize: !options.development,
      }),
    ],
    output: {
      filename: "[name].js",
      chunkFilename: "[name].js",
      assetModuleFilename: options.development ? "assets/[file]" : "[contenthash][ext][query]",
      path: options.outDir,
      module: true,
      chunkFormat: "module",
      chunkLoading: "import",
      hashDigest: "base64url",
      hashDigestLength: 8,
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
    experiments: {
      outputModule: true,
      topLevelAwait: true,
      futureDefaults: true,
    },
  }

  if (options.clean) {
    if (isObject(options.clean)) {
      config.plugins.push(new CleanWebpackPlugin(options.clean))
    } else if (Array.isArray(options.clean)) {
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

  if (options.nodeExternals) {
    const externalsStrategy = isString(options.nodeExternals) ? options.nodeExternals : "pkg"
    debug("Externals strategy: %s", externalsStrategy)
    const externalsStrategies = {
      pkg: request => {
        if (pkg.dependencies?.[request] || pkg.peerDependencies?.[request]) {
          return `module ${request}`
        }
      },
      packageRegex: request => {
        if (/^@?([\da-z-]+\/)*([\d.a-z-]+)$/.test(request)) {
          return `module ${request}`
        }
      },
    }
    config.externals = async ({request}) => {
      const resolvingChoice = externalsStrategies[externalsStrategy](request)
      if (resolvingChoice) {
        debug("External: %s", request)
        return resolvingChoice
      } else {
        debug("Bundling: %s", request)
      }
    }
  }

  // TODO Temporarily disabled
  // Test error: https://pastebin.com/raw/N5HRsrZ2
  if (options.documentation && false) {
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
    /**
     * @type {import("publishimo-webpack-plugin").pluginOptions}
     */
    const publishimoConfig = {
      autoMain: options.type === "cli" ? "bin" : true,
      autoTypes: Boolean(options.documentation),
      banner: false,
      includeFields: ["type"],
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

  if (options.banner) {
    let pluginOptions
    if (options.banner === true) {
      pluginOptions = {}
    } else {
      pluginOptions = options.banner
    }
    config.plugins.push(new PkgBannerPlugin(pluginOptions))
  }

  if (options.include) {
    const patterns = ensureArray(options.include).map(value => {
      if (isString(value)) {
        return {
          from: value,
          noErrorOnMissing: true,
        }
      }
      return value
    })
    config.plugins.push(new CopyWebpackPlugin({patterns}))
  }

  if (isString(options.hashbang)) {
    config.plugins.push(new webpack.BannerPlugin({
      banner: ensureStart(options.hashbang.trim(), "#!"),
      raw: true,
      entryOnly: true,
      test: "index",
    }))
  }

  if (!options.development) {
    Object.assign(config.optimization, {
      chunkIds: "deterministic",
      concatenateModules: true,
      mangleExports: "size",
      removeAvailableModules: true,
      runtimeChunk: {
        name: "runtime",
      },
      splitChunks: {
        chunks: "async",
        cacheGroups: {
          defaultVendors: {
            test: /[/\\]node_modules[/\\]/,
            name: "vendor",
            chunks: "all",
          },
        },
      },
    })
    if (options.terserOptions === false) {
      debug("terserOptions is false, skipping minification")
      config.optimization.minimize = false
    } else {
      debug("terserOptions: %o", options.terserOptions)
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: options.terserOptions,
          ...options.terserPluginOptions,
        }),
      ]
    }
  }

  // TODO license-webpack-plugin is currently forced to be excluded until I find a solution for the ENOENT scandir error
  if (!options.development && options.licenseFileName && false) {
    config.plugins.push(new LicenseWebpackPlugin({
      renderLicenses,
      outputFilename: options.licenseFileName,
      perChunkOutput: false, // This is important, this combines all the project's third party licenses into a single file, will throw a “Conflict: Multiple assets emit different content to the same filename” otherwise
    }))
  }

  if (options.excludeLocale) {
    config.plugins.push(new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }))
  }

  debug("Base config: %o", config)

  const extra = []

  const typeProviderWebpackConfig = typeProvider.getWebpackConfig({
    pkg,
    env,
    options,
    fromRoot,
    entryFolder,
    initialWebpackConfig: config,
  })

  if (hasContent(typeProviderWebpackConfig)) {
    extra.push(typeProviderWebpackConfig)
  }

  const typeProviderDefines = typeProvider.getDefines()
  if (hasContent(typeProviderDefines)) {
    config.plugins.push(new webpack.DefinePlugin(typeProviderDefines))
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

  for (const [index, extraEntry] of extra.entries()) {
    debug("Extra config #%d: %o", index + 1, extraEntry)
  }

  const mergedConfig = extra.length ? webpackMerge(config, ...extra) : config

  if (process.env.webpackDevtool) {
    debug("Forced devtool from env: %s", process.env.webpackDevtool)
    mergedConfig.devtool = process.env.webpackDevtool
  }

  if (options.configOutput) {
    const outputFile = options.configOutput === true ? fromRoot("dist", "webpack-config-jaid", "webpackConfig.yml") : path.resolve(options.configOutput)
    outputYaml(outputFile, mergedConfig)
    const optionsOutputFile = path.resolve(outputFile, "..", "options.yml")
    outputYaml(optionsOutputFile, options)
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
    outputYaml(pluginsOutputFile, plugins)
  }

  debug("Final Webpack config: %O", mergedConfig)

  return mergedConfig
}