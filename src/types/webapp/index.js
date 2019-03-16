import {isObject} from "lodash"
import RobotsTxtPlugin from "robotstxt-webpack-plugin"
import CnamePlugin from "cname-webpack-plugin"
import WebappPlugin from "webapp-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"
import ScriptExtPlugin from "script-ext-html-webpack-plugin"
import MonacoEditorPlugin from "monaco-editor-webpack-plugin"
import webpackMerge from "webpack-merge"
import webpack from "webpack"

import getPostcssConfig from "./getPostcssConfig"

export const defaultOptions = () => ({
  nodeExternals: false,
})

export const webpackConfig = ({options, pkg, fromRoot, initialWebpackConfig}) => {
  const port = process.env.webpackPort || 1212
  const title = options.title || pkg.title || pkg.config?.title || "App"
  const srcDirectory = fromRoot("src")

  const internalCssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      modules: true,
      localIdentName: options.development ? "[folder]_[local]_[hash:base62:4]" : "[hash:base64:6]",
    },
  }

  const externalCssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      localIdentName: options.development ? "[folder]_[local]_[hash:base62:4]" : "[hash:base64:4]",
    },
  }

  const postcssLoader = {
    loader: "postcss-loader",
    options: getPostcssConfig(options),
  }

  let additionalWebpackConfig = {
    target: "web",
    output: {
      publicPath: `http://localhost:${port}/`,
      filename: options.development ? "index.js" : "[chunkhash:6].js",
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|woff2|ico)$/,
          loader: "url-loader",
        },
        {
          test: /\.md$/,
          use: ["html-loader", "markdown-loader"],
        },
        {
          test: /\.(css|postcss|scss)$/,
          use: {
            loader: "style-loader",
            options: {
              hmr: options.development,
              singleton: !options.development,
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
            cssLoader,
            postcssLoader,
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlPlugin({
        title,
        debug: options.development,
        alwaysWriteToDisk: true,
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
      new ScriptExtPlugin({
        defaultAttribute: "defer",
      }),
    ],
  }

  if (options.development) {
    additionalWebpackConfig = webpackMerge.smart(additionalWebpackConfig, {
      entry: [
        "react-hot-loader/patch",
        `webpack-dev-server/client?http://localhost:${port}/`,
        "webpack/hot/only-dev-server",
        initialWebpackConfig.entry,
      ],
      devServer: {
        port,
        publicPath: `http://localhost:${port}/`,
        inline: true,
        lazy: false,
        hot: true,
        noInfo: true,
        overlay: true,
        stats: "errors-only",
        headers: {"Access-Control-Allow-Origin": "*"},
        contentBase: fromRoot("dist", "package", "development"),
        historyApiFallback: {
          verbose: true,
          disableDotRule: false,
        },
      },
      plugins: [new webpack.HotModuleReplacementPlugin],
      resolve: {
        alias: {
          "react-dom": "@hot-loader/react-dom",
        },
      },
    })
  }

  if (!options.development) {
    if (options.icon) {
      additionalWebpackConfig.plugins.push(new WebappPlugin({
        logo: options.icon,
        prefix: "/",
        cache: "cache/webapp-webpack-plugin",
        inject: true,
        emitStats: false,
        favicons: {
          appName: title,
          appDescription: pkg.description,
          developerName: pkg.author?.name,
          developerURL: pkg.author?.url,
          version: pkg.version,
          background: "#283c31",
          theme_color: "#adffb3",
          orientation: "portrait",
          icons: {
            appleIcon: {offset: 10},
            appleStartup: true,
            coast: {offset: 10},
            firefox: {offset: 15},
          },
        },
      }))
    }
    if (options.domain) {
      additionalWebpackConfig.plugins.push(new CnamePlugin({domain: options.domain}))
    }
    if (options.robots === true) {
      additionalWebpackConfig.plugins.push(new RobotsTxtPlugin)
    } else if (isObject(options.robots)) {
      additionalWebpackConfig.plugins.push(new RobotsTxtPlugin(options.robots))
    }
  }
  if (options.includeMonacoEditor) {
    const pluginOptions = isObject(options.includeMonacoEditor) ? options.includeMonacoEditor : {
      languages: ["javascript", "json"],
    }
    additionalWebpackConfig.plugins.push(new MonacoEditorPlugin(pluginOptions))
  }

  return additionalWebpackConfig
}