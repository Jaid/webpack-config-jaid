/** @module webpack-config-jaid */

import generateWebpackConfig from "./generateWebpackConfig"

/**
 * @typedef {object} webpackConfigJaidOptions
 * @property {string} [packageRoot=require("app-root-path")()] Directory of your Node project
 * @property {boolean} [development=process.env.NODE_ENV !== "production"] Webpack mode ("development" or "production")
 * @property {object} [extra={}] Additional Webpack configuration
 * @property {object} [extraProduction={}] Additional Webpack configuration that only gets applied in development mode
 * @property {object} [extraDevelopment={}] Additional Webpack configuration that only gets applied in production mode
 * @property {"cli"|"nodeLib"|"nodeClass"|"universalLib"|"universalClass"|"webapp"|"nodeScript"|"photoshopPlugin"|"coreGeneratorPlugin"} [type=null] The project type which will automatically add some configuration
 * @property {array} [include=["readme.*","README.*","license.*","LICENSE.*"]] Files (relative to project directory) that get copied to dist directory
 * @property {boolean|object} [publishimo=false] Set to true to include publishimo-webpack-plugin, or set as object to add options for the plugin instance
 * @property {boolean|object} [documentation=false] Set to true to include jsdoc-tsd-webpack-plugin, or set as object to add options for the plugin instance
 * @property {boolean} [nodeExternals=true] If true, package dependencies will be loaded at runtime with require(), if false, they will be bundled
 * @property {boolean|string} [configOutput=false] Path to a file where the generated Webpack config gets written to
 * @property {boolean|string[]|object} [clean=!options.development] If false, no files and folders will be removed. If true, removed folders will be decided automatically. If an array is given, its paths will be removed. If an object is given, removed folders will be decided automatically and `options.clean` will be forwarded to the constructor of CleanWebpackPlugin.
 * @property {string} [title=null] Project title
 * @property {boolean|object} [robots=false] For type `webapp`: If `true`, output robots.txt
 * @property {string} [icon=null] For type `webapp`: If typeof `string`, this will be used as path to png icon
 * @property {string} [domain] For type `webapp`: If typeof `string`, this will be used as domain for CNAME
 * @property {boolean|object} [includeMonacoEditor=false] For type `webapp`: If `true`, Monaco editor will be included with basic configuration. If typeof `object`, this will be used as configuration for MonacoEditorWebpackPlugin constructor. If `isArray`, this will be used for `languages` field.
 * @property {boolean} [createCssFile=false] For type `webapp`: If `true`, `extract-text-webpack-plugin` will be used to create a separate CSS file. If typeof `object`, this will be used as configuration for MiniCssExtractPlugin constructor.
 * @property {boolean} [optimizeCss=false] For type `webapp`: If `true`, `optimize-css-assets-webpack-plugin` will be used minify output CSS. If typeof `object`, this will be used as configuration for OptimizeCssAssetsPlugin constructor.
 * @property {boolean} [inlineSource=false] For type `webapp`: If `true`, CSS and JavaScript content will be directly included into the HTML file
 * @property {string} [hashbang=null] If typeof `string`, writes a hashbang to the top of the entry script. If it does not start with `!#`, it will be added automatically.
 * @property {false|string} [licenseFileName=null] If typeof `string`, this will be the file where the third party license comments get extracted to.
 * @property {object} [terserOptions] Additional options for `terser`
 * @property {object} [terserPluginOptions] Additional options for `terser-webpack-plugin`
 * @property {string} [sourceFolder=path.join(packageRoot, "src")] Folder where an `index.js` is placed in
 * @property {string} [outDir=path.join(packageRoot, "dist", "package", env)] Output destination
 * @property {string} [backgroundColor=13061b] For type `webapp` if `options.icon` is defined: The webapp background color
 * @property {string} [themeColor=a12fdc] For type `webapp` if `options.icon` is defined: The webapp theme color
 * @property {string} [publicPath] Like `webpackConfig.publicPath`, but also applies to any plugin
 * @property {boolean} [excludeLocale=true] Exclude i18n data for `moment`
 * @property {string} [appDescription=pkg.description || pkg.title]
 * @property {string} [twitterSiteHandle] For type `webapp`: Twitter handle of the website for the output HTML's meta tags
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

/**
 * Creates Webpack config based on given options, uses type "webapp"
 * @function configureWebapp
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureWebapp = options => generateWebpackConfig({
  ...options,
  type: "webapp",
})

/**
 * Creates Webpack config based on given options, uses type "nodeScript"
 * @function configureNodeScript
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureNodeScript = options => generateWebpackConfig({
  ...options,
  type: "nodeScript",
})

/**
 * Creates Webpack config based on given options, uses type "photoshopPlugin"
 * @function configurePhotoshopPlugin
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configurePhotoshopPlugin = options => generateWebpackConfig({
  ...options,
  type: "photoshopPlugin",
})

/**
 * Creates Webpack config based on given options, uses type "generatorCorePlugin"
 * @function configureGeneratorCorePlugin
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureGeneratorCorePlugin = options => generateWebpackConfig({
  ...options,
  type: "generatorCorePlugin",
})

/**
 * Creates Webpack config based on given options, uses type "executable"
 * @function configureExecutable
 * @param {webpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureExecutable = options => generateWebpackConfig({
  ...options,
  type: "executable",
})