import pascalCase from "pascal-case"

module.exports = ({config, pkg}) => {
  Object.assign(config.output, {
    libraryTarget: "umd2",
    library: {
      root: pascalCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    },
  })
}