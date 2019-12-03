import {camelCase} from "lodash"

import {commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    module: true,
  },
})

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd2",
      globalObject: "this",
    },
  }
  if (pkg?.name) {
    config.output.library = camelCase(pkg.name)
  }
  return config
}