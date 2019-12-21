/**
 * @typedef {Object} GenerateWebpackConfigContext
 * @prop {string} entryFolder
 * @prop {Object} pkg
 * @prop {import("webpack").Configuration} initialWebpackConfig
 * @prop {(...directive: string) => string} fromRoot
 * @prop {import("../index").WebpackConfigJaidOptions} options
 */

const types = {
  adobeCep: require("./adobeCep"),
  cli: require("./cli"),
  executable: require("./executable"),
  generatorCorePlugin: require("./generatorCorePlugin"),
  nodeClass: require("./nodeClass"),
  nodeLib: require("./nodeLib"),
  nodeScript: require("./nodeScript"),
  photoshopPlugin: require("./photoshopPlugin"),
  universalClass: require("./universalClass"),
  universalLib: require("./universalLib"),
  webapp: require("./webapp"),
}

export default types