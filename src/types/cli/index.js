import {commonTerserOptions, configureNode} from "src/configFragments"

export const defaultOptions = () => ({
  hashbang: "/usr/bin/env node",
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
  },
  publishimo: true,
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "cli.js",
  },
})