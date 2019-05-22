import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  include: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    compress: {
      passes: 5,
      ecma: 6,
      unsafe: true,
      booleans_as_integers: true,
    },
  },
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "app.js",
  },
})