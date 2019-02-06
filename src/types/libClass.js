import pascalCase from "pascal-case"

export default (config, {pkg}) => {
  config.target = "node"
  config.output = {
    ...config.output,
    libraryTarget: "umd2",
    library: {
      root: pascalCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    },
  }
}