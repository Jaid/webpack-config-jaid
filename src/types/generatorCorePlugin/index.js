import {camelCase, isObject} from "lodash-es"

import webpackMerge from "../../lib/esm/webpack-merge.js"
import Node from "../node/index.js"

const generatorCorePackageField = "generator-core-version"
const generatorCoreLatestVersion = "3.12"

export default class extends Node {

  /**
   * @function
   * @param {import("../WebpackConfigType").GetDefaultOptionsContext} context
   */
  getDefaultOptions() {
    const terserOptions = this.createTerserOptions({
      toplevel: true,
      output: {
        ecma: 5,
      },
    })
    return {
      terserOptions,
    }
  }

  /**
   * @function
   * @param {import("../index").WebpackConfigJaidOptions} options
   */
  processOptions(options) {
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
    if (Array.isArray(publishimoOptions.includeFields)) {
      publishimoOptions.includeFields.push(generatorCorePackageField)
    } else {
      publishimoOptions.includeFields = [generatorCorePackageField]
    }
    if (publishimoOptions.productionOnly === undefined) {
      publishimoOptions.productionOnly = false
    }
    publishimoOptions[generatorCorePackageField] = `^${generatorCoreLatestVersion}`
  }

  /**
   * @function
   * @param {import("../WebpackConfigType").GetWebpackConfigContext} context
   */
  getWebpackConfig({pkg}) {
    const nodeConfig = super.getWebpackConfig()
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
    return webpackMerge(nodeConfig, config)
  }

}