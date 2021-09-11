import camelcase from "camelcase"

import isCi from "../lib/isCi.js"

/**
 * @typedef {Object} GetDefaultOptionsContext
 * @prop {string} env
 * @prop {import("src/index").WebpackConfigJaidOptions} options
 */

/**
 * @typedef {Object} ProcessOptionsContext
 * @prop {string} env
 * @prop {(...directive: [string]) => string} fromRoot
 */

/**
 * @typedef {Object} GetWebpackConfigContext
 * @prop {string} entryFolder
 * @prop {Object} pkg
 * @prop {import("webpack").Configuration} initialWebpackConfig
 * @prop {(...directive: [string]) => string} fromRoot
 * @prop {import("src/index").WebpackConfigJaidOptions} options
 */

export default class WebpackConfigType {

  /**
   * @type {Object}
   */
  pkg = null

  /**
   * @type {import("src/index").WebpackConfigJaidOptions}
   */
  options = null

  /**
   * @function
   * @param {GetDefaultOptionsContext} context
   * @return {import("src/index").WebpackConfigJaidOptions}
   */
  getDefaultOptions(context) {
    return {}
  }

  /**
   * @function
   * @param {import("src/index").WebpackConfigJaidOptions} options
   * @param {ProcessOptionsContext} context
   */
  processOptions(options, context) {
  }

  /**
   * @param {import("src/types/WebpackConfigType").GetWebpackConfigContext} context
   * @return {import("webpack").Configuration}
   */
  getWebpackConfig(context) {
    return {}
  }

  /**
   * @function
   * @return {Object}
   */
  getDefines() {
    return {}
  }

  /**
   * @function
   * @param {Object} pkg
   * @return {string}
   */
  getLibraryNameFromPkg(pkg) {
    return camelcase(pkg.name)
  }

  /**
   * @function
   * @param {import("terser").MinifyOptions} additional
   * @return {import("terser").MinifyOptions}
   */
  createTerserOptions(additional) {
    return {
      compress: {
        passes: isCi ? 10 : 1,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      output: {
        ecma: 2019,
        // License comment is line 2 if hashbang is given, line 1 if not.
        comments: (_astTop, astToken) => {
          return astToken.line < 3
        },
      },
      ...additional,
    }
  }

  /**
   * @return {string}
   */
  getTitle() {
    return this.options.title || this.pkg.title || this.pkg.name || "Page"
  }

  /**
   * @return {string}
   */
  getDescription() {
    return this.options.appDescription || this.pkg.description || null
  }

}