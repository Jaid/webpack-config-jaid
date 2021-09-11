import fss from "@absolunet/fss"
import OfflinePlugin from "@lcdp/offline-plugin"
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import CnamePlugin from "cname-webpack-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import ensureStart from "ensure-start"
import HtmlFaviconPlugin from "html-favicon-webpack-plugin"
import {escape, isObject, omit, uniq} from "lodash-es"
import LogWatcherPlugin from "log-watcher-webpack-plugin"
import SitemapXmlPlugin from "sitemap-xml-webpack-plugin"
import urlJoin from "url-join"
import {addDevServerEntrypoints} from "webpack-dev-server"
import PwaManifestPlugin from "webpack-pwa-manifest"
import WorkboxPlugin from "workbox-webpack-plugin"
import createDebug from "debug"

import webpackMerge from "../../lib/webpackMerge.js"

import Html from "../../types/html/index.js"

const debug = createDebug(process.env.REPLACE_PKG_NAME)

export default class extends Html {

  /**
   * @type {string}
   */
  themeColor = null

  /**
   * @type {string}
   */
  backgroundColor = null

  /**
   * @function
   * @return {import("src/index").WebpackConfigJaidOptions}
   */
  getDefaultOptions() {
    const parentOptions = super.getDefaultOptions()
    return {
      ...parentOptions,
      inlineSource: false,
      sitemap: true,
      offline: true,
      pwa: true,
      banner: true,
      createCssFile: true,
    }
  }

  /**
   * @return {string}
   */
  getPublicPath() {
    if (this.isHot()) {
      return `http://localhost:${this.port}/`
    }
    return super.getPublicPath()
  }

  /**
   * @return {Object}
   */
  getMeta() {
    const parentMeta = super.getMeta()
    const meta = {
      ...parentMeta,
      HandheldFriendly: true,
    }
    if (!this.options.development) {
      meta.description = this.description
      meta["format-detection"] = "telephone=no"
      meta["og:type"] = "website"
      meta["twitter:card"] = "summary"
      meta["og:updated_time"] = Date.now()
      meta["og:determiner"] = ""
      meta["og:description"] = this.description
      meta["twitter:description"] = this.description
      meta["og:title"] = this.title
      meta["twitter:title"] = this.title
      if (this.pkg.author?.name) {
        meta.author = this.pkg.author?.name
      }
      if (this.options.locale) {
        meta["og:locale"] = this.options.locale.replace("-", "_")
      }
      if (this.options.twitterSiteHandle || this.options.twitterAuthorHandle) {
        meta["twitter:site"] = ensureStart(this.options.twitterSiteHandle || this.options.twitterAuthorHandle, "@")
      }
      if (this.options.twitterAuthorHandle) {
        meta["twitter:creator"] = ensureStart(this.options.twitterAuthorHandle, "@")
      }
      if (this.options.domain && this.options.pwa) {
        const baseUrl = `https://${this.options.domain}`
        const metaIconSize = 384
        const imageUrl = urlJoin(baseUrl, `icon_${metaIconSize}x${metaIconSize}.png`)
        meta["og:url"] = baseUrl
        meta["og:image:width"] = metaIconSize
        meta["og:image:height"] = metaIconSize
        meta["og:image:type"] = "image/png"
        meta["og:image"] = imageUrl
        meta["twitter:image"] = imageUrl
      }
    }
    return meta
  }

  /**
   * @return {boolean}
   */
  shouldInlineJavascript() {
    return false
  }

  /**
   * @return {import("webpack").RuleSetRule}
   */
  getImageLoader() {
    if (this.options.development) {
      return super.getImageLoader()
    }
    return {
      test: this.getImageFileRegex(),
      oneOf: [
        {
          resourceQuery: /\?raw/,
          use: omit(super.getImageLoader(), "test"),
        },
        {
          loader: "modern-image-loader",
        },
      ],
    }
  }

  /**
   * @return {string}
   */
  getBodyContent() {
    const textColor = "#888"
    const text = this.title || this.pkg?.name || this.domain || "Loading"
    const escapedText = escape(text)
    // Non-minified version: https://codesandbox.io/s/react-dom-loading-placeholder-content-3ddp9
    return `<div><style>body{background:black;margin:0}i:after{content:"";display:block;width:.7em;height:.7em;margin:.5em;border-radius:50%;border:4px solid;border-color:${textColor} transparent ${textColor} transparent;animation:a 1s linear infinite;animation-timing-function:ease;box-sizing:initial}@keyframes a{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}main{position:fixed;width:100vw;height:100vh;color:${textColor};display:flex;justify-content:center;align-items:center;font-size:2em;font-family:Ubuntu,sans-serif;flex-direction:column-reverse}</style><main><i></i>${escapedText}</main></div>`
  }

  /**
   * @return {Object}
   */
  getCnamePluginOptions() {
    return {
      domain: this.domain,
    }
  }

  /**
   * @return {Object}
   */
  getRobotsTxtPluginOptions() {
    if (isObject(this.options.robots)) {
      return this.options.robots
    }
    return {
      host: `https://${this.domain}`,
      sitemap: `https://${this.domain}/sitemap.xml`,
    }
  }

  /**
   * @return {import("sitemap-xml-webpack-plugin").pluginOptions}
   */
  getSitemapXmlPluginOptions() {
    const pluginOptions = {
      domain: this.domain,
    }
    if (isObject(this.options.sitemap)) {
      Object.assign(pluginOptions, this.options.sitemap)
    }
    return pluginOptions
  }

  /**
   * @return {import("css-minimizer-webpack-plugin").Options}
   */
  getCssMinimizerPluginOptions() {
    if (isObject(this.options.optimizeCss)) {
      return this.options.optimizeCss
    }
    if (this.options.optimizeCss === true) {
      return {
        minimizerOptions: {
          preset: [
            "advanced",
            {
              discardComments: {removeAll: true},
            },
          ],
        },
      }
    }
    return null
  }

  /**
   * @return {string}
   */
  getThemeColor() {
    if (this.options.themeColor) {
      return ensureStart(this.options.themeColor, "#")
    }
    return "#00CC00"
  }

  /**
   * @return {string}
   */
  getBackgroundColor() {
    if (this.options.backgroundColor) {
      return ensureStart(this.options.backgroundColor, "#")
    }
    return "#000000"
  }

  /**
   * @return {import("webpack-pwa-manifest").ManifestOptions}
   */
  getPwaManifestPluginOptions() {
    if (isObject(this.options.pwa)) {
      return this.options.pwa
    }
    /**
     * @type {import("webpack-pwa-manifest").ManifestOptions}
     */
    const pluginOptions = {
      description: this.description,
      orientation: "portrait",
      display: "standalone",
      name: this.title,
      inject: true,
      fingerprints: false,
      theme_color: this.themeColor,
      background_color: this.backgroundColor,
      ios: {
        "apple-mobile-web-app-title": this.title,
        "apple-mobile-web-app-status-bar-style": "black-translucent",
      },
      start_url: `https://${this.options.domain}`,
      publicPath: `https://${this.options.domain}`,
      icons: [
        {
          src: this.iconFile,
          sizes: [
            16,
            24,
            32,
            64,
            80,
            92,
            128,
            192,
            256,
            384,
            512,
          ],
        },
      ],
    }
    if (this.options.development) {
      pluginOptions.start_url = "."
    } else {
      pluginOptions.start_url = `https://${this.options.domain}`
      pluginOptions.publicPath = `https://${this.options.domain}`
    }
    return pluginOptions
  }

  /**
   * @return {import("html-favicon-webpack-plugin").Options}
   */
  getHtmlFaviconPluginOptions() {
    return {
      href: urlJoin(this.publicPath, "icon_128x128.png"), // TODO Replace with shorter name, see https://github.com/arthurbergmz/webpack-pwa-manifest/issues/36#issuecomment-568140796
    }
  }

  getOfflinePluginOptions() {
    if (!this.options.offline) {
      return
    }
    return {
      safeToUseOptionalCaches: true,
      appShell: "index.html",
      caches: {
        main: [
          "*.js",
          "*.css",
          "*.html",
          "manifest.json",
        ],
        additional: [
          "*.woff",
          "*.woff2",
          "*.jpg",
          "*.jpeg",
          "*.png",
          "*.webp",
        ],
        optional: [":rest:"],
      },
      ServiceWorker: {
        events: true,
      },
      AppCache: {
        events: true,
      },
      excludes: [
        "**/*.txt",
        "CNAME",
      ],
      version: this.pkg.version || String(Date.now()),
      ...this.options.offline,
    }
  }

  /**
   * @return {import("workbox-webpack-plugin").GenerateSWOptions}
   */
  getWorkboxPluginOptions() {
    return {
      clientsClaim: true,
      skipWaiting: true,
    }
  }

  /**
   * @param {import("src/types/WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig(context) {
    const {fromRoot, initialWebpackConfig} = context
    this.iconFile = fromRoot("icon.png")
    debug("Using icon %s", this.iconFile)
    this.description = this.getDescription()
    this.themeColor = this.getThemeColor()
    this.backgroundColor = this.getBackgroundColor()
    const iconFileExists = fss.pathExists(this.iconFile)
    if (!iconFileExists) {
      throw new Error(`File ${this.iconFile} not found`)
    }
    const parentConfig = super.getWebpackConfig(context)
    this.domain = this.options.domain
    /**
     * @type {import("webpack").Configuration}
     */
    let webpackConfig = {
      plugins: [],
    }
    if (this.hot) {
      // Need to ignore both front slash versions and back slash versions of paths for Windows support
      const ignoredPaths = [
        fromRoot("dist"),
        fromRoot("dist").replaceAll("\\", "/"),
        fromRoot(".git"),
        fromRoot(".git").replaceAll("\\", "/"),
      ]
      const devServerConfig = {
        // publicPath: this.publicPath,
        port: this.port,
        hot: true,
        overlay: true,
        // headers: {"Access-Control-Allow-Origin": "*"},
        historyApiFallback: true,
      }
      webpackConfig = webpackMerge(webpackConfig, {
        devServer: devServerConfig,
      })
      addDevServerEntrypoints(webpackConfig, devServerConfig)
      webpackConfig = webpackMerge(webpackConfig, {
        watchOptions: {
          ignored: uniq(ignoredPaths),
        },
      })
      webpackConfig.plugins.push(new ReactRefreshPlugin)
      webpackConfig.plugins.push(new LogWatcherPlugin)
    }
    webpackConfig.plugins.push(new HtmlFaviconPlugin(this.getHtmlFaviconPluginOptions()))
    if (!this.options.development) {
      webpackConfig.plugins.push(new PwaManifestPlugin(this.getPwaManifestPluginOptions()))
      webpackConfig.plugins.push(new CnamePlugin(this.getCnamePluginOptions()))
      // TODO robotstxt-webpack-plugin is no longer mainainted, replace with something else
      // https://github.com/itgalaxy/robotstxt-webpack-plugin
      // webpackConfig.plugins.push(new RobotsTxtPlugin(this.getRobotsTxtPluginOptions()))
      webpackConfig.plugins.push(new SitemapXmlPlugin(this.getSitemapXmlPluginOptions()))
      const cssMinimizerPluginOptions = this.getCssMinimizerPluginOptions()
      if (cssMinimizerPluginOptions) {
        webpackConfig.plugins.push(new CssMinimizerPlugin(cssMinimizerPluginOptions))
      }
      const offlinePluginOptions = this.getOfflinePluginOptions()
      if (offlinePluginOptions) {
        webpackConfig.plugins.push(new OfflinePlugin(offlinePluginOptions))
      }
      const workboxPluginOptions = this.getWorkboxPluginOptions()
      if (workboxPluginOptions) {
        webpackConfig.plugins.push(new WorkboxPlugin.GenerateSW(workboxPluginOptions))
      }
    }
    const finalConfig = webpackMerge(parentConfig, webpackConfig)
    return finalConfig
  }

}