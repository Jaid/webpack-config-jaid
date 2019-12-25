import fss from "@absolunet/fss"
import CnamePlugin from "cname-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import ensureStart from "ensure-start"
import HtmlFaviconPlugin from "html-favicon-webpack-plugin"
import {isObject, uniq} from "lodash"
import LogWatcherPlugin from "log-watcher-webpack-plugin"
import MonacoEditorPlugin from "monaco-editor-webpack-plugin"
import OfflinePlugin from "offline-plugin"
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin"
import RobotsTxtPlugin from "robotstxt-webpack-plugin"
import SitemapXmlPlugin from "sitemap-xml-webpack-plugin"
import urlJoin from "url-join"
import webpack from "webpack"
import webpackMerge from "webpack-merge"
import PwaManifestPlugin from "webpack-pwa-manifest"

import Html from "src/types/html"

const debug = require("debug")(_PKG_NAME)

export default class extends Html {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetDefaultOptionsContext} context
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
    }
  }

  /**
   * @return {string}
   */
  getPublicPath() {
    if (this.options.publicPath) {
      return this.options.publicPath
    } else if (this.isHot()) {
      return `http://localhost:${this.options.port}/`
    } else {
      return ""
    }
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
   * @return {import("optimize-css-assets-webpack-plugin").Options}
   */
  getOptimizeCssAssetsPluginOptions() {
    if (isObject(this.options.optimizeCss)) {
      return this.options.optimizeCss
    }
    if (this.options.optimizeCss === true) {
      return {
        cssProcessorPluginOptions: {
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
   * @param {import("src/types/WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig(context) {
    const {fromRoot, initialWebpackConfig} = context
    this.iconFile = fromRoot("icon.png")
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
        fromRoot("dist").replace(/\\/g, "/"),
        fromRoot(".git"),
        fromRoot(".git").replace(/\\/g, "/"),
      ]
      webpackConfig = webpackMerge.smart(webpackConfig, {
        watch: true,
        watchOptions: {
          ignored: uniq(ignoredPaths),
        },
        entry: [
          "react-hot-loader/patch",
          `webpack-dev-server/client?http://localhost:${this.port}/`,
          "webpack/hot/only-dev-server",
          initialWebpackConfig.entry,
        ],
        devServer: {
          port: this.port,
          hot: true,
          overlay: true,
          headers: {"Access-Control-Allow-Origin": "*"},
          historyApiFallback: {
            verbose: true,
            disableDotRule: false,
          },
        },
        resolve: {
          alias: {
            "react-dom": "@hot-loader/react-dom",
          },
        },
      })
      webpackConfig.plugins.push(new LogWatcherPlugin)
    }
    if (!this.options.development) {
      webpackConfig.plugins.push(new CnamePlugin(this.getCnamePluginOptions()))
      webpackConfig.plugins.push(new RobotsTxtPlugin(this.getRobotsTxtPluginOptions()))
      webpackConfig.plugins.push(new SitemapXmlPlugin(this.getSitemapXmlPluginOptions()))
      const optimizeCssAssetsPluginOptions = this.getOptimizeCssAssetsPluginOptions()
      if (optimizeCssAssetsPluginOptions !== null) {
        webpackConfig.plugins.push(new OptimizeCssAssetsPlugin(optimizeCssAssetsPluginOptions))
      }
    }
    return webpackMerge.smart(parentConfig, webpackConfig)
  }

}