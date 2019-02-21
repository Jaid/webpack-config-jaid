import pascalCase from "pascal-case"

export const defaultOptions = () => ({
  nodeExternals: false,
})

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd",
      globalObject: "this",
    },
  }
  if (pkg?.name) {
    config.output.library = {
      root: pascalCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return config
}