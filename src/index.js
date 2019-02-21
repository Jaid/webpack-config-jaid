/** @module webpack-config-jaid */

import generateWebpackConfig from "./generateWebpackConfig"

/**
 * @typedef {object} webpackConfigJaidOptions
 * @property {string} [packageRoot=require("app-root-path")()] Directory of your Node project
 * @property {boolean} [development=process.env.NODE_ENV !== "production"] Webpack mode ("development" or "production")
 * @property {object} [extra={}] Additional Webpack configuration
 * @property {object} [extraProduction={}] Additional Webpack configuration that only gets applied in development mode
 * @property {object} [extraDevelopment={}] Additional Webpack configuration that only gets applied in production mode
 * @property {"cli"|"nodeLib"|"nodeClass"|"universalLib"|"universalClass"} [type=null] The project type which will automatically add some configuration
 * @property {array} [include=["readme.*","README.*","license.*","LICENSE.*"]] Files (relative to project directory) that get copied to dist directory
 * @property {boolean|object} [publishimo=false] Set to true to include publishimo-webpack-plugin, or set as object to add options for the plugin instance
 * @property {boolean|object} [documentation=false] Set to true to include jsdoc-tsd-webpack-plugin, or set as object to add options for the plugin instance
 * @property {boolean} [nodeExternals=true] If true, package dependencies will be loaded at runtime with require(), if false, they will be bundled
 * @property {boolean|string} [configOutput=false] Path to a file where the generated Webpack config gets written to
 * @property {boolean|string[]|object} [clean=!options.development] If false, no files and folders will be removed. If true, removed folders will be decided automatically. If an array is given, its paths will be removed. If an object is given, removed folders will be decided automatically and `options.clean` will be forwarded to the constructor of CleanWebpackPlugin.
 */

/**
 * Creates Webpack config based on given options
 * @function default
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export default generateWebpackConfig

/**
 * Creates Webpack config based on given options, uses type "cli"
 * @function configureCli
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureCli = options => generateWebpackConfig({
  ...options,
  type: "cli",
})

/**
 * Creates Webpack config based on given options, uses type "nodeLib"
 * @function configureNodeLib
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureNodeLib = options => generateWebpackConfig({
  ...options,
  type: "nodeLib",
})

/**
 * Creates Webpack config based on given options, uses type "nodeClass"
 * @function configureNodeClass
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureNodeClass = options => generateWebpackConfig({
  ...options,
  type: "nodeClass",
})

/**
 * Creates Webpack config based on given options, uses type "universalLib"
 * @function configureUniversalLib
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureUniversalLib = options => generateWebpackConfig({
  ...options,
  type: "universalLib",
})

/**
 * Creates Webpack config based on given options, uses type "universalClass"
 * @function configureUniversalClass
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureUniversalClass = options => generateWebpackConfig({
  ...options,
  type: "universalClass",
})