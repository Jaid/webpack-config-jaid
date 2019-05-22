import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
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

export const webpackConfig = () => configureNode({})