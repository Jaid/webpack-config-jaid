/** @module webpack-config-jaid */

import generateWebpackConfig from "./generateWebpackConfig"

/**
 * @typedef {object} webpackConfigJaidOptions
 * @property {string} [packageRoot=appRootPath()] Directory of your Node project
 * @property {boolean} [development=process.env.NODE_ENV] Webpack mode ("development" or "production")
 * @property {object} [extra={}] Additional Webpack configuration
 * @property {object} [extraProduction={}] Additional Webpack configuration that only gets applied in development mode
 * @property {object} [extraDevelopment={}] Additional Webpack configuration that only gets applied in production mode
 * @property {null|"cli"|"lib"|"libClass"} [type="lib"] The project type which will automatically add some configuration
 * @property {array} [include=["readme.*","README.*","license.*","LICENSE.*"]] Files (relative to project directory) that get copied to dist directory
 * @property {boolean|object} [publishimo=false] Set to true to include publishimo-webpack-plugin, or set as object to add options for the plugin instance
 * @property {boolean|object} [documentation=false] Set to true to include jsdoc-tsd-webpack-plugin, or set as object to add options for the plugin instance
 */

/**
 * Creates Webpack config based on given options
 * @param {webpackConfigJaidOptions} options Given options
 * @returns {object} Webpack configuration object
 */
export default generateWebpackConfig

export const cli = options => generateWebpackConfig({
  ...options,
  type: "cli",
})

export const lib = options => generateWebpackConfig({
  ...options,
  type: "lib",
})

export const libClass = options => generateWebpackConfig({
  ...options,
  type: "libClass",
})