import {configureNode} from "src/configFragments"
import pascalCase from "pascal-case"

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd2",
    },
  }
  if (pkg?.name) {
    config.output.library = {
      root: pascalCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return configureNode(config)
}