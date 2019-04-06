import {camelCase, isObject, isArray} from "lodash"
import {configureNode} from "src/configFragments"

const generatorCorePackageField = "generator-core-version"
const generatorCoreLatestVersion = "3.12"

export const processOptions = options => {
  const publishimoOptions = options.publishimo
  if (!isObject(publishimoOptions)) {
    options.publishimo = {
      includeFields: [generatorCorePackageField],
      "generator-core-version": `^${generatorCoreLatestVersion}`,
      productionOnly: false,
    }
    return
  }
  if (publishimoOptions[generatorCorePackageField]) {
    return
  }
  if (publishimoOptions.includeFields |> isArray) {
    publishimoOptions.includeFields.push(generatorCorePackageField)
  }
  publishimoOptions[generatorCorePackageField] = `^${generatorCoreLatestVersion}`
}

export const webpackConfig = ({pkg}) => {
  const config = {
    output: {
      libraryTarget: "commonjs2",
    },
  }
  if (pkg?.name) {
    config.output.library = {
      root: camelCase(pkg.name),
      amd: pkg.name,
      commonjs: pkg.name,
    }
  }
  return configureNode(config)
}