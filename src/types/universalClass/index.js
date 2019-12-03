import pascalCase from "pascal-case"

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
    config.output.library = {
      root: pascalCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return config
}