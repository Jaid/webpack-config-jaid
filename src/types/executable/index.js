import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  include: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    compress: {
      passes: 5,
      unsafe: true,
      drop_console: true,
    },
  },
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "app.js",
  },
})