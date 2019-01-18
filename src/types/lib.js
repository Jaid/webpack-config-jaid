import {camelCase} from "lodash"

module.exports = ({config, options, pkg}) => {
  Object.assign(config.output, {
    ...config.output,
    libraryTarget: "umd2", // I don't know the difference to "umd" (it's not documented anywhere), but it has a "2" in it so it MUST be better! :D
    library: {
      root: camelCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    },
  })
}