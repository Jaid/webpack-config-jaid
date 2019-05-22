import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  hashbang: "/usr/bin/env node",
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    compress: {
      ...commonTerserOptions.compress,
      unsafe: true,
    },
  },
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "cli.js",
  },
})