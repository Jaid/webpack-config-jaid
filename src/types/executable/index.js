import {commonTerserOptions, configureNode} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
  },
  publishimo: true,
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "app.js",
  },
})