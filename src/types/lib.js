import {camelCase} from "lodash"

export default (config, {pkg}) => {
  config.target = "node"
  config.output = {
    ...config.output,
    libraryTarget: "umd2",
    library: {
      root: camelCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    },
  }
}