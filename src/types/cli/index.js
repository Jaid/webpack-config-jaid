import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  hashbang: "/usr/bin/env node",
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
  },
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "cli.js",
  },
})