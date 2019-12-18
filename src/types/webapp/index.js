import CnamePlugin from "cname-webpack-plugin"
import ensureStart from "ensure-start"
import {isEmpty} from "has-content"
import HtmlInlineSourcePlugin from "html-webpack-inline-source-plugin"
import HtmlPlugin from "html-webpack-plugin"
import {isObject, uniq} from "lodash"
import LogWatcherPlugin from "log-watcher-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import MonacoEditorPlugin from "monaco-editor-webpack-plugin"
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin"
import RobotsTxtPlugin from "robotstxt-webpack-plugin"
import ScriptExtPlugin from "script-ext-html-webpack-plugin"
import SitemapXmlPlugin from "sitemap-xml-webpack-plugin"
import webpack from "webpack"
import webpackMerge from "webpack-merge"

import getPostcssConfig from "lib/getPostcssConfig"

import {commonTerserOptions} from "src/configFragments"

const base64UrlLimit = 1000

const binaryAssetTest = /\.(svg|woff|woff2|ttf|eot|otf|mp4|flv|webm|mp3|flac|ogg|m4a|aac)$/
const imageAssetTest = /\.(png|jpg|jpeg|webp|gif)$/

const debug = require("debug")(_PKG_NAME)

export const defaultOptions = () => ({
  nodeExternals: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
  },
})

export const webpackConfig = ({options, pkg, fromRoot, initialWebpackConfig, entryFolder}) => {
  const port = process.env.webpackPort
  const srcDirectory = entryFolder
  const getPublicPath = () => {
    if (options.publicPath) {
      return options.publicPath
    } else if (port) {
      return `http://localhost:${port}/`
    } else if (!options.development && options.domain && process.env.CI) {
      return `//${options.domain}/`
    } else {
      return ""
    }
  }

  const publicPath = getPublicPath()
  debug("Public path: \"%s\"", publicPath)

  const title = options.title || pkg.title || pkg.config?.title || pkg.name || "App"
  const description = options.appDescription || pkg.description || title
  debug("Title: %s", title)

  const meta = {
    viewport: "width=device-width,initial-scale=1,user-scalable=no",
    HandheldFriendly: true,
  }

  if (!options.development) {
    meta.description = description
    meta["format-detection"] = "telephone=no"
    meta["og:type"] = "website"
    meta["twitter:card"] = "summary"
    meta["og:updated_time"] = Date.now()
    meta["og:determiner"] = ""
    meta["og:description"] = description
    meta["twitter:description"] = description

    if (pkg.author?.name) {
      meta.author = pkg.author?.name
    }

    if (options.locale) {
      meta["og:locale"] = options.locale.replace("-", "_")
    }

    if (options.twitterSiteHandle || options.twitterAuthorHandle) {
      meta["twitter:site"] = ensureStart(options.twitterSiteHandle || options.twitterAuthorHandle, "@")
    }

    if (options.twitterAuthorHandle) {
      meta["twitter:creator"] = ensureStart(options.twitterAuthorHandle, "@")
    }

    if (title) {
      meta["og:title"] = title
      meta["twitter:title"] = title
    }

    if (options.domain) {
      const baseUrl = `https://${options.domain}/`
      const imageUrl = `${baseUrl}coast-228x228.png`
      meta["og:url"] = baseUrl
      meta["og:image:width"] = 228
      meta["og:image:height"] = 228
      meta["og:image:type"] = "image/png"
      meta["og:image"] = imageUrl
      meta["twitter:image"] = imageUrl
    }
  }

  const cssIdentName = options.development ? "[folder]_[local]_[hash:base62:4]" : "[hash:base64:6]"

  const internalCssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      modules: {
        localIdentName: cssIdentName,
      },
    },
  }

  const externalCssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      modules: false,
    },
  }

  const postcssLoader = {
    loader: "postcss-loader",
    options: getPostcssConfig(options),
  }

  const styleLoaders = [
    {
      test: /\.(css|scss)$/,
      use: {
        loader: options.createCssFile && !port ? MiniCssExtractPlugin.loader : "style-loader",
        options: {
          injectType: options.development ? "styleTag" : "singletonStyleTag",
        },
      },
    },
    {
      test: /\.css$/,
      include: srcDirectory,
      use: [
        internalCssLoader,
        postcssLoader,
      ],
    },
    {
      test: /\.css$/,
      exclude: srcDirectory,
      use: [
        externalCssLoader,
        postcssLoader,
      ],
    },
    {
      test: /\.scss$/,
      use: [
        internalCssLoader,
        postcssLoader,
        "resolve-url-loader",
        {
          loader: "sass-loader",
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ]

  let additionalWebpackConfig = {
    target: "web",
    node: {
      fs: "empty",
    },
    output: {
      publicPath,
      filename: options.development ? "index.js" : "[chunkhash:6].js",
    },
    module: {
      rules: [
        {
          test: binaryAssetTest,
          use: {
            loader: "url-loader",
            options: {
              limit: base64UrlLimit,
              fallback: {
                loader: "file-loader",
                options: {
                  publicPath,
                  name: options.development ? "[path][name].[ext]" : "[hash:base62:6].[ext]",
                },
              },
            },
          },
        },
        options.development
          ? {
            test: imageAssetTest,
            loader: "file-loader",
            options: {
              publicPath,
              name: "[path][name]-untouched.[ext]",
            },
          }
          : {
            test: imageAssetTest,
            oneOf: [
              {
                resourceQuery: /\?untouched(&|$)/,
                use: {
                  loader: "url-loader",
                  options: {
                    limit: base64UrlLimit,
                    fallback: {
                      loader: "file-loader",
                      options: {
                        publicPath,
                        name: "[hash:base62:6].[ext]",
                      },
                    },
                  },
                },
              },
              {
                resourceQuery: /\?set(&|$)/,
                loader: "responsive-loader",
                options: {
                  name: "[hash:base62:6].[ext]",
                  placeholder: true,
                  placeholderSize: 32,
                  quality: 95,
                  sizes: [
                    16,
                    32,
                    64,
                    128,
                    256,
                    512,
                    1024,
                  ],
                },
              },
              {
                use: [
                  {
                    loader: "url-loader",
                    options: {
                      limit: base64UrlLimit,
                      fallback: {
                        loader: "file-loader",
                        options: {
                          publicPath,
                          name: "[hash:base62:6].webp",
                        },
                      },
                    },
                  },
                  {
                    loader: "webp-loader?{quality: 95, nearLossless: 50, sharpness: 5}",
                  },
                ],
              },
            ],
          },
        {
          test: /\.md$/,
          use: ["html-loader", "markdown-loader"],
        },
        ...styleLoaders,
      ],
    },
    plugins: [
      new HtmlPlugin({
        title,
        meta,
        debug: options.development,
        alwaysWriteToDisk: true,
        inlineSource: ".(js|css)$",
        minify: options.development ? false : {
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
      }),
    ],
  }

  if (options.inlineSource) {
    additionalWebpackConfig.plugins.push(new HtmlInlineSourcePlugin)
  } else {
    additionalWebpackConfig.plugins.push(new ScriptExtPlugin({
      defaultAttribute: "defer",
    }))
  }

  if (port) {
    // Need to ignore both front slash versions and back slash versions of paths for Windows support
    const ignoredPaths = [
      fromRoot("dist"),
      fromRoot("dist").replace(/\\/g, "/"),
      fromRoot(".git"),
      fromRoot(".git").replace(/\\/g, "/"),
    ]
    additionalWebpackConfig = webpackMerge.smart(additionalWebpackConfig, {
      watch: true,
      watchOptions: {
        ignored: uniq(ignoredPaths),
      },
      entry: [
        "react-hot-loader/patch",
        `webpack-dev-server/client?http://localhost:${port}/`,
        "webpack/hot/only-dev-server",
        initialWebpackConfig.entry,
      ],
      devServer: {
        port,
        hot: true,
        overlay: true,
        headers: {"Access-Control-Allow-Origin": "*"},
        historyApiFallback: {
          verbose: true,
          disableDotRule: false,
        },
        // contentBase: fromRoot("dist", "package", "development"),
        // stats: "verbose",
        // noInfo: true,
        // lazy: false,
      },
      resolve: {
        alias: {
          "react-dom": "@hot-loader/react-dom",
        },
      },
    })
    additionalWebpackConfig.plugins.push(new LogWatcherPlugin)
  }

  if (!options.development) {
    if (options.icon) {
      const faviconsConfig = {
        appName: title,
        appDescription: description,
        version: pkg.version,
        background: ensureStart(options.backgroundColor, "#"),
        theme_color: ensureStart(options.themeColor, "#"),
        orientation: "portrait",
        icons: {
          appleIcon: {offset: 10},
          appleStartup: true,
          coast: {offset: 10},
          firefox: {offset: 15},
        },
      }
      if (meta.author) {
        faviconsConfig.developerName = meta.author
      }
      if (pkg.author?.url) {
        faviconsConfig.developerURL = pkg.author.url
      }
      // additionalWebpackConfig.plugins.push(new FaviconsPlugin({
      //   publicPath,
      //   logo: options.icon,
      //   prefix: "/",
      //   cache: fromRoot("dist", "cache", "favicons-webpack-plugin"),
      //   inject: true,
      //   emitStats: false,
      //   favicons: faviconsConfig,
      // }))
    }

    if (options.domain) {
      additionalWebpackConfig.plugins.push(new CnamePlugin({domain: options.domain}))
    }

    if (options.robots === true) {
      if (options.domain) {
        additionalWebpackConfig.plugins.push(new RobotsTxtPlugin({
          host: `https://${options.domain}`,
          sitemap: `https://${options.domain}/sitemap.xml`,
        }))
      } else {
        additionalWebpackConfig.plugins.push(new RobotsTxtPlugin)
      }
    } else if (isObject(options.robots)) {
      additionalWebpackConfig.plugins.push(new RobotsTxtPlugin(options.robots))
    }

    if (options.sitemap) {
      if (!options.domain) {
        throw new Error("options.sitemap is truthy, but options.domain is not set")
      }
      if (options.sitemap === true) {
        additionalWebpackConfig.plugins.push(new SitemapXmlPlugin(options.domain))
      } else if (options.sitemap |> isObject) {
        additionalWebpackConfig.plugins.push(new SitemapXmlPlugin({
          domain: options.domain,
          ...options.sitemap,
        }))
      }
    }

    if (options.optimizeCss) {
      const pluginOptions = isObject(options.optimizeCss) ? options.optimizeCss : {
        cssProcessorPluginOptions: {
          preset: [
            "advanced",
            {
              discardComments: {removeAll: true},
            },
          ],
        },
      }

      additionalWebpackConfig.plugins.push(new OptimizeCssAssetsPlugin(pluginOptions))
    }
  }

  if (options.includeMonacoEditor) {
    let pluginOptions
    if (Array.isArray(options.includeMonacoEditor)) {
      pluginOptions = {
        languages: options.includeMonacoEditor,
      }
    } else if (isObject(options.includeMonacoEditor)) {
      pluginOptions = options.includeMonacoEditor
    } else {
      pluginOptions = {
        languages: ["javascript", "plaintext"],
      }
    }
    additionalWebpackConfig.plugins.push(new MonacoEditorPlugin(pluginOptions))
  }

  if (options.createCssFile) {
    const pluginOptions = isObject(options.createCssFile) ? options.createCssFile : {
      filename: options.development ? "[name].css" : "[contenthash:6].css",
      chunkFilename: options.development ? "[id].css" : "[contenthash:6].css",
    }
    additionalWebpackConfig.plugins.push(new MiniCssExtractPlugin(pluginOptions))
  }

  const getGoogleAnalyticsTrackingId = () => {
    if (options.googleAnalyticsTrackingId |> isEmpty) {
      return false
    }
    if (options.googleAnalyticsOnlyInProduction && options.development) {
      return false
    }
    return options.googleAnalyticsTrackingId
  }

  additionalWebpackConfig.plugins.push(new webpack.DefinePlugin({
    GOOGLE_ANALYTICS_TRACKING_ID: getGoogleAnalyticsTrackingId() |> JSON.stringify,
  }))

  return additionalWebpackConfig
}

export const defines = {
  "process.browser": "true",
}