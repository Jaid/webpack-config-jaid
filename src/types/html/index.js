import BrowserSyncPlugin from "browser-sync-webpack-plugin"
import camelcase from "camelcase"
import createDebug from "debug"
import HtmlPlugin from "html-webpack-plugin"
import InjectBrowserSyncPlugin from "inject-browser-sync-webpack-plugin"
import {isObject, uniq} from "lodash-es"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack, {HotModuleReplacementPlugin} from "webpack"

import HtmlInlineCssPlugin from "../../lib/esm/html-inline-css-webpack-plugin.js"
import InjectBodyPlugin from "../../lib/esm/inject-body-webpack-plugin.js"
import logWatcherWebpackPlugin from "../../lib/esm/log-watcher-webpack-plugin.js"
import getPostcssConfig from "../../lib/getPostcssConfig.js"
import isCi from "../../lib/isCi.js"
import WebpackConfigType from "../WebpackConfigType.js"

const debug = createDebug(process.env.REPLACE_PKG_NAME)

export default class extends WebpackConfigType {

  /**
   * @type {number}
   */
  port = null

  /**
   * @type {boolean}
   */
  hot = false

  /**
   * @type {string}
   */
  srcDirectory = null

  /**
   * @type {string}
   */
  publicPath = null

  /**
   * @type {string}
   */
  title = null

  /**
   * @type {string}
   */
  description = null

  /**
   * @type {Object}
   */
  meta = null

  /**
   * @type {boolean}
   */
  useMiniCssExtractPlugin = null

  /**
   * @type {number}
   */
  base64UrlLimit = null

  /**
   * @function
   * @param {import("../WebpackConfigType.js").GetDefaultOptionsContext} context
   * @return {import("src/index").WebpackConfigJaidOptions}
   */
  getDefaultOptions() {
    const terserOptions = this.createTerserOptions({
      toplevel: true,
    })
    return {
      terserOptions,
      nodeExternals: false,
      inlineSource: true,
      createCssFile: false,
      optimizeCss: true,
      banner: false,
      include: false,
    }
  }

  /**
   * @return {RegExp}
   */
  getBinaryFileRegex() {
    return /\.(svg|woff|woff2|ttf|eot|otf|mp4|flv|webm|mp3|flac|ogg|m4a|aac)$/
  }

  /**
   * @return {RegExp}
   */
  getImageFileRegex() {
    return /\.(png|jpg|jpeg|webp|gif)$/
  }

  /**
   * return {number}
   */
  getBase64UrlLimit() {
    return 0
  }

  /**
   * @function
   * @param {import("src/index").WebpackConfigJaidOptions} options
   * @param {ProcessOptionsContext} context
   */
  processOptions(options) {
    this.hot = Boolean(options.port)
  }

  /**
   * @return {boolean}
   */
  isHot() {
    return this.hot
  }

  /**
   * @return {string}
   */
  getPublicPath() {
    return this.options.publicPath || "."
  }

  /**
   * @param {string} pkgName
   * @return {string}
   */
  getLibraryName(pkgName) {
    return camelcase(pkgName)
  }

  /**
   * @return {Object}
   */
  getMeta() {
    return {
      viewport: "width=device-width,initial-scale=1,user-scalable=no",
    }
  }

  /**
   * @return {import("html-webpack-plugin").Options}
   */
  getHtmlPluginOptions() {
    /**
     * @type {import("html-webpack-plugin").Options}
     */
    const htmlPluginOptions = {
      title: this.title,
      meta: this.meta,
      debug: this.options.development,
      minify: this.options.development ? false : {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      },
    }
    if (!this.options.development && this.options.domain && isCi) {
    // TODO This is for html-webpack-plugin v4
    // htmlPluginOptions.base = `https://${options.domain}`
    }
    return htmlPluginOptions
  }

  /**
   * @return {import("webpack").Loader}
   */
  getStyleLoader() {
    if (this.isHot()) {
      return "style-loader"
      // TODO Would prefer MiniCssExtractPlugin, but it just doesn't work with HMR
      // return {
      //   loader: MiniCssExtractPlugin.loader,
      //   options: {
      //     hmr: true,
      //   },
      // }
    }
    if (this.options.createCssFile) {
      return {
        loader: MiniCssExtractPlugin.loader,
      }
    }
    return {
      loader: "style-loader",
      options: {
        injectType: this.options.development ? "styleTag" : "singletonStyleTag",
      },
    }
  }

  /**
   * @return {import("webpack").Loader}
   */
  getInternalCssLoader() {
    let loaderOptions
    if (this.options.development) {
      loaderOptions = {
        sourceMap: true,
        modules: {
          localIdentName: "[folder]_[local]_[contenthash:4]",
        },
      }
    } else {
      loaderOptions = {
        modules: {
          localIdentName: "[contenthash:6]",
        },
      }
    }
    return {
      loader: "css-loader",
      options: loaderOptions,
    }
  }

  /**
   * @return {import("webpack").Loader}
   */
  getExternalCssLoader() {
    return {
      loader: "css-loader",
      options: {
        sourceMap: this.options.development,
        modules: false,
      },
    }
  }

  /**
   * @return {import("webpack").Loader}
   */
  getPostcssLoader() {
    return {
      loader: "postcss-loader",
      options: getPostcssConfig(this.options),
    }
  }

  /**
   * @return {import("mini-css-extract-plugin").PluginOptions}
   */
  getMiniCssExtractPluginOptions() {
    if (isObject(this.options.createCssFile)) {
      return this.options.createCssFile
    } else {
      return {
        filename: this.options.development ? "[name].css" : `${this.pkg.version || "[contenthash:6]"}.css`,
        chunkFilename: this.options.development ? "[id].css" : "[contenthash:6].css",
      }
    }
  }

  /**
   * @return {import("browser-sync").Options}
   */
  getBrowserSyncOptions() {
    /**
     * @type {import("browser-sync").Options}
     */
    const pluginOptions = {
      codeSync: false,
    }
    if (Number(this.options.browserSync) > 1) {
      pluginOptions.port = Number(this.options.browserSync)
    } else {
      pluginOptions.port = 3000
    }
    return pluginOptions
  }

  /**
   * @return {import("browser-sync-webpack-plugin").Options}
   */
  getBrowserSyncPluginOptions() {
    return {}
  }

  /**
   * @return {string}
   */
  getGoogleAnalyticsTrackingId() {
    if (!this.options.googleAnalyticsTrackingId) {
      return null
    }
    if (this.options.googleAnalyticsOnlyInProduction && this.options.development) {
      return null
    }
    return this.options.googleAnalyticsTrackingId
  }

  /**
   * @return {boolean}
   */
  shouldInlineJavascript() {
    return true
  }

  /**
   * @return {string}
   */
  getBodyContent() {
    return null
  }

  /**
   * @return {import("webpack").RuleSetRule}
   */
  getImageLoader() {
    const testRegex = this.getImageFileRegex()
    if (this.options.development) {
      return {
        test: testRegex,
        type: "asset/resource",
      }
    }
    return {
      test: testRegex,
      type: "asset",
      parser: {
        dataUrlCondition: {
          maxSize: this.base64UrlLimit,
        },
      },
    }
  }

  /**
   * @param {import("src/types/WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig({options, entryFolder, fromRoot, initialWebpackConfig}) {
    if (options.devPort) {
      this.port = options.devPort
    }
    if (process.env.webpackPort) {
      this.port = Number(process.env.webpackPort)
    }
    this.hot = Boolean(this.port)
    this.srcDirectory = entryFolder
    this.publicPath = this.getPublicPath()
    debug("Public path: \"%s\"", this.publicPath)
    this.title = this.getTitle()
    this.meta = this.getMeta()
    const htmlPluginOptions = this.getHtmlPluginOptions()
    const styleLoader = this.getStyleLoader()
    const internalCssLoader = this.getInternalCssLoader()
    const externalCssLoader = this.getExternalCssLoader()
    const postcssLoader = this.getPostcssLoader()
    this.useMiniCssExtractPlugin = styleLoader.loader === MiniCssExtractPlugin.loader
    const internalCssChain = [
      styleLoader,
      internalCssLoader,
      postcssLoader,
    ]
    const externalCssChain = [
      styleLoader,
      externalCssLoader,
      postcssLoader,
    ]
    const sassChain = [
      styleLoader,
      internalCssLoader,
      postcssLoader,
      "resolve-url-loader",
      "sass-loader",
    ]
    const styleLoaders = [
      {
        test: /\.css$/,
        include: this.srcDirectory,
        use: internalCssChain,
      },
      {
        test: /\.css$/,
        exclude: this.srcDirectory,
        use: externalCssChain,
      },
      {
        test: /(\.scss|\.sass)$/,
        use: sassChain,
      },
    ]
    const binaryFileRegex = this.getBinaryFileRegex()
    this.base64UrlLimit = this.getBase64UrlLimit()
    /**
     * @type {import("webpack").Configuration}
     */
    const webpackConfig = {
      target: "web",
      resolve: {
        fallback: {
          fs: false,
        },
      },
      output: {
        publicPath: this.publicPath,
        // filename: options.development ? undefined : `${this.pkg.version || "[chunkhash:6]"}.js`,
      },
      module: {
        rules: [
          {
            test: binaryFileRegex,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: this.base64UrlLimit,
              },
            },
          },
          this.getImageLoader(),
          {
            test: /\.md$/,
            use: ["html-loader", "markdown-loader"],
          },
          ...styleLoaders,
        ],
      },
      plugins: [new HtmlPlugin(htmlPluginOptions)],
    }

    const bodyContent = this.getBodyContent()
    if (bodyContent) {
      webpackConfig.plugins.push(new InjectBodyPlugin({
        content: bodyContent,
      }))
    }

    // TODO Find an alternative to the now deprecated ScriptExtPlugin inline feature
    // https://github.com/numical/script-ext-html-webpack-plugin#deprecation-warning
    if (this.shouldInlineJavascript()) {
      // webpackConfig.plugins.push(new ScriptExtPlugin({
      //   inline: /\.js$/,
      // }))
      debug("Requested to inline javascript, but inlining is ignored right now")
    }

    if (this.useMiniCssExtractPlugin) {
      const pluginOptions = this.getMiniCssExtractPluginOptions()
      webpackConfig.plugins.push(new MiniCssExtractPlugin(pluginOptions))
      webpackConfig.plugins.push(new HtmlInlineCssPlugin)
    }

    if (this.options.development && this.options.browserSync) {
      const browserSyncOptions = this.getBrowserSyncOptions()
      const pluginOptions = this.getBrowserSyncPluginOptions()
      webpackConfig.plugins.push(new BrowserSyncPlugin(browserSyncOptions, pluginOptions))
      webpackConfig.plugins.push(new InjectBrowserSyncPlugin({
        port: browserSyncOptions.port,
      }))
    }

    const googleAnalyticsTrackingId = this.getGoogleAnalyticsTrackingId()
    webpackConfig.plugins.push(new webpack.DefinePlugin({
      GOOGLE_ANALYTICS_TRACKING_ID: JSON.stringify(googleAnalyticsTrackingId),
    }))

    if (options.development && this.hot) {
      // Need to ignore both front slash versions and back slash versions of paths for Windows support
      const ignoredPaths = [
        fromRoot("dist"),
        fromRoot("dist").replaceAll("\\", "/"),
        fromRoot(".git"),
        fromRoot(".git").replaceAll("\\", "/"),
      ]
      webpackConfig = {
        watchOptions: {
          ignored: uniq(ignoredPaths),
        },
        entry: {
          ...initialWebpackConfig.entry,
          devServer: {
            import: "webpack/hot/dev-server.js",
            filename: "devServer.js",
          },
          devServerClient: "webpack-dev-server/client/index.js?hot=true&live-reload=true",
        },
        devServer: {
          // publicPath: this.publicPath,
          port: this.port,
          hot: true,
          client: {
            overlay: true,
          },
          headers: {"Access-Control-Allow-Origin": "*"},
          historyApiFallback: true,
        },
        plugins: [
          new HotModuleReplacementPlugin,
          new logWatcherWebpackPlugin,
        ],
      }
    }

    return webpackConfig
  }

  getDefines() {
    return {
      "process.browser": "true",
    }
  }

}