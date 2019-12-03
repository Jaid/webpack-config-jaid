import {commonTerserOptions, configureNode} from "src/configFragments"

export const defaultOptions = () => ({
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
  },
})

export const webpackConfig = () => configureNode({})