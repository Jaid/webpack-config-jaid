import camelcase from "camelcase"

import {commonTerserOptions, configureNode} from "src/configFragments"

export const defaultOptions = () => ({
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    module: true,
  },
  publishimo: true,
})

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd2",
    },
  }
  if (pkg?.name) {
    config.output.library = {
      root: camelcase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return configureNode(config)
}