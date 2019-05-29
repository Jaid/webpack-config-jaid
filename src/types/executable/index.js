import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    compress: {
      ...commonTerserOptions.compress,
      ecma: 6,
      booleans_as_integers: true,
    },
  },
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "app.js",
  },
})