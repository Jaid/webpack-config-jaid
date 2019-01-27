import pascalCase from "pascal-case"

module.exports = ({config, options, pkg}) => {
  Object.assign(config.output, {
    ...config.output,
    libraryTarget: "umd2",
    library: {
      root: pascalCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    },
  })
}