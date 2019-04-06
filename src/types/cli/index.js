import {configureNode} from "src/configFragments"

export const defaultOptions = () => ({
  hashbang: "/usr/bin/env node",
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "cli.js",
  },
})