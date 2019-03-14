import path from "path"

import {isObject} from "lodash"
import RobotsTxtPlugin from "robotstxt-webpack-plugin"
import CnamePlugin from "cname-webpack-plugin"
import WebappPlugin from "webapp-webpack-plugin"
import HtmlPlugin from "html-webpack-plugin"
// import HarddiskPlugin from "html-webpack-harddisk-plugin"
import ScriptExtPlugin from "script-ext-html-webpack-plugin"
import webpackMerge from "webpack-merge"
import webpack from "webpack"

export const defaultOptions = () => ({
  nodeExternals: false,
})

const getPostcssConfig = options => {
  const plugins = []

  const addPlugin = (plugin, pluginOptions) => {
    const pluginName = plugin[0] === "-" ? `postcss${plugin}` : plugin
    plugins.push(__non_webpack_require__(pluginName)(pluginOptions))
  }

  addPlugin("-nested") // Resolves nested blocks
  addPlugin("-preset-env") // Adds a bunch of CSS features
  addPlugin("-easings") // Translates some easings from http://easings.net/
  addPlugin("-import") // Inlines @import statements
  addPlugin("-center") // Adds "top: center" and "left: center"

  if (!options.development) {
    addPlugin("-sorting", { // Sorts property names alphabetically
      order: [
        "custom-properties",
        "dollar-variables",
        "declarations",
        "rules",
        "at-rules",
      ],
      "properties-order": [
        "content",
        "display",
        "flex",
        "width",
        "height",
        "margin",
        "padding",
      ],
      "unspecified-properties-position": "bottomAlphabetical",
    })
    addPlugin("-ordered-values") // Sorts arguments of properties, border for example
    addPlugin("cssnano", { // Minifies output
      reduceIdents: true, // http://cssnano.co/guides/optimisations
    })
  }

  return {
    plugins,
    ident: "postcss",
  }
}

export const webpackConfig = ({options, pkg, fromRoot}) => {
  const port = process.env.webpackPort || 1212
  const title = options.title || pkg.title || pkg.config?.title || "App"

  const cssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      modules: true,
      localIdentName: options.development ? "[folder]_[local]_[hash:base62:4]" : "[hash:base64:6]",
    },
  }

  const postcssLoader = {
    loader: "postcss-loader",
    options: getPostcssConfig(options),
  }

  let additionalWebpackConfig = {
    module: {
      rules: [
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
          test: /\.(css|postcss)$/,
          use: [
            cssLoader,
            postcssLoader,
          ],
        },
        {
          test: /\.scss$/, // scss without local css-modules
          use: [
            cssLoader,
            postcssLoader,
            "sass-loader",
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2|ico)$/,
          loader: "url-loader",
        },
        {
          test: /\.md$/,
          use: ["html-loader", "markdown-loader"],
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
        fromRoot("src"),
      ],
      devServer: {
        port,
        publicPath: `http://localhost:${port}/dist/`,
        inline: true,
        lazy: false,
        hot: true,
        noInfo: true,
        overlay: true,
        stats: "errors-only",
        headers: {"Access-Control-Allow-Origin": "*"},
        contentBase: path.resolve(__dirname, "..", "dist"),
        historyApiFallback: {
          verbose: true,
          disableDotRule: false,
        },
      },
      plugins: [new webpack.HotModuleReplacementPlugin],
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

  return additionalWebpackConfig
}