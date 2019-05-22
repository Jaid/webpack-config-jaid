import {camelCase} from "lodash"
import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    module: true,
    compress: {
      passes: 5,
      unsafe: true,
    },
  },
})

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd2",
    },
  }
  if (pkg?.name) {
    config.output.library = {
      root: camelCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return configureNode(config)
}