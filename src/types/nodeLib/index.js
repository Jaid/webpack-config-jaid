import {camelCase} from "lodash"

export const webpackConfig = ({pkg}) => {
  const config = {
    target: "node",
    optimization: {
      nodeEnv: false,
    },
    node: {
      __dirname: false,
      __filename: false,
      process: false,
      Buffer: false,
      setImmediate: false,
    },
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
  return config
}