import CepPlugin from "cep-webpack-plugin"
import {isEmpty} from "has-content"
import HtmlInlineSourcePlugin from "html-webpack-inline-source-plugin"
import HtmlPlugin from "html-webpack-plugin"
import {isObject} from "lodash"
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin"
import webpack from "webpack"

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

export const webpackConfig = ({options, pkg, entryFolder}) => {
  const srcDirectory = entryFolder
  const publicPath = do {
    if (options.publicPath) {
      options.publicPath
    } else if (options.development) {
      srcDirectory
    } else {
      ""
    }
  }
  debug("Public path: \"%s\"", publicPath)

  const title = options.title || pkg.title || pkg.config?.title || pkg.name || "App"
  debug("Title: %s", title)

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
        loader: "style-loader",
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

  const additionalWebpackConfig = {
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
      new HtmlInlineSourcePlugin,
      new CepPlugin({
        title,
        version: pkg.version,

      }),
    ],
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