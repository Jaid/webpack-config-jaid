import {camelCase} from "lodash"

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "umd",
      globalObject: "this",
    },
  }
  if (pkg?.name) {
    config.output.library = camelCase(pkg.name)
  }
  return config
}