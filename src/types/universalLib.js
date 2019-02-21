import {camelCase} from "lodash"

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd",
      globalObject: "this",
    },
  }
  if (pkg?.name) {
    config.output.library = {
      root: camelCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return config
}