import {camelCase} from "lodash"

module.exports = ({config, pkg}) => {
  Object.assign(config, {
    target: "node",
  })
  Object.assign(config.output, {
    libraryTarget: "umd2",
    library: {
      root: camelCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    },
  })
}