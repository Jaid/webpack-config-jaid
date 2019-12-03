import camelcase from "camelcase"

import {commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
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
      globalObject: "this",
    },
  }
  if (pkg?.name) {
    config.output.library = camelcase(pkg.name)
  }
  return config
}