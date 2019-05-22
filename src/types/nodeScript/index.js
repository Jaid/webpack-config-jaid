import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    compress: {
      ...commonTerserOptions.compress,
      unsafe: true,
    },
  },
})

export const webpackConfig = () => configureNode({})