const path = require("path")

const chalk = require("chalk")
const webpack = require("webpack")
const prettyBytes = require("pretty-bytes")

const createConfig = require("../../build").default

const webpackConfig = createConfig({
  lib: true,
  extra: {
    output: {
      path: path.join(__dirname, "dist"),
    },
  },
  packageRoot: __dirname,
  isDevelopment: false,
})

webpack(webpackConfig, (error, stats) => {
  if (error) {
    throw new Error(error)
  }

  for (const [asset, meta] of Object.entries(stats.compilation.assets)) {
    const humanizedSize = prettyBytes(meta._value.length) // eslint-disable-line no-underscore-dangle
    console.log(chalk.green(`${asset}: ${humanizedSize}`))
  }
})