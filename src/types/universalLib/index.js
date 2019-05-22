import {camelCase} from "lodash"
import {commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
    module: true,
    compress: {
      passes: 5,
      unsafe: true,
      drop_console: true,
    },
  },
})

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd",
      globalObject: "this",
    },
  }
  if (pkg?.name) {
    config.output.library = camelCase(pkg.name)
  }
  return config
}