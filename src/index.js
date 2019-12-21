/** @module webpack-config-jaid */

import generateWebpackConfig from "./generateWebpackConfig"

/**
 * @typedef {Object} TypeProvider
 * @prop {(context) => Object} defaultOptions
 * @prop {(context) => Object} webpackConfig
 * @prop {(options, context) => void} processOptions
 * @prop {Object<string, string>} defines
 */

/**
 * @typedef {Object} WebpackConfigJaidOptions
 * @prop {string} [packageRoot=require("app-root-path")()] Directory of your Node project
 * @prop {boolean} [development=process.env.NODE_ENV !== "production"] Webpack mode ("development" or "production")
 * @prop {object} [extra={}] Additional Webpack configuration
 * @prop {object} [extraProduction={}] Additional Webpack configuration that only gets applied in development mode
 * @prop {object} [extraDevelopment={}] Additional Webpack configuration that only gets applied in production mode
 * @prop {"cli"|"nodeLib"|"nodeClass"|"universalLib"|"universalClass"|"webapp"|"nodeScript"|"photoshopPlugin"|"coreGeneratorPlugin"|TypeProvider} [type=null] The project type which will automatically add some configuration
 * @prop {array} [include=["readme.*","license.*"]] Files (relative to project directory) that get copied to dist directory
 * @prop {boolean|object} [publishimo=false] Set to true to include publishimo-webpack-plugin, or set as object to add options for the plugin instance
 * @prop {boolean|object} [documentation=false] Set to true to include jsdoc-tsd-webpack-plugin, or set as object to add options for the plugin instance
 * @prop {boolean} [nodeExternals=true] If true, package dependencies will be loaded at runtime with require(), if false, they will be bundled
 * @prop {boolean|string} [configOutput=false] If true, generated Webpack config and plugin info will be written to `dist/webpack-config-jaid`
 * @prop {boolean|string[]|object} [clean=!options.development] If false, no files and folders will be removed. If true, removed folders will be decided automatically. If an array is given, its paths will be removed. If an object is given, removed folders will be decided automatically and `options.clean` will be forwarded to the constructor of CleanWebpackPlugin.
 * @prop {string} [title=null] Project title
 * @prop {boolean|object} [robots=false] For type `webapp`: If `true`, output robots.txt
 * @prop {string} [icon=null] For type `webapp`: If typeof `string`, this will be used as path to png icon
 * @prop {string} [domain] For type `webapp`: If typeof `string`, this will be used as domain for CNAME
 * @prop {boolean|object} [includeMonacoEditor=false] For type `webapp`: If `true`, Monaco editor will be included with basic configuration. If typeof `object`, this will be used as configuration for MonacoEditorWebpackPlugin constructor. If `isArray`, this will be used for `languages` field.
 * @prop {boolean} [createCssFile=false] For type `webapp`: If `true`, `extract-text-webpack-plugin` will be used to create a separate CSS file. If typeof `object`, this will be used as configuration for MiniCssExtractPlugin constructor.
 * @prop {boolean} [optimizeCss=false] For type `webapp`: If `true`, `optimize-css-assets-webpack-plugin` will be used to minify output CSS. If typeof `object`, this will be used as configuration for OptimizeCssAssetsPlugin constructor.
 * @prop {boolean} [inlineSource=false] For type `webapp`: If `true`, CSS and JavaScript content will be directly included into the HTML file
 * @prop {string} [hashbang=null] If typeof `string`, writes a hashbang to the top of the entry script. If it does not start with `!#`, it will be added automatically.
 * @prop {false|string} [licenseFileName=null] If typeof `string`, this will be the file where the third party license comments get extracted to.
 * @prop {object} [terserOptions] Additional options for `terser`
 * @prop {object} [terserPluginOptions] Additional options for `terser-webpack-plugin`
 * @prop {string} [sourceFolder=path.join(packageRoot, "src")] Folder where an `index.js` is placed in
 * @prop {string} [outDir=path.join(packageRoot, "dist", "package", env)] Output destination
 * @prop {string} [backgroundColor=13061b] For type `webapp` if `options.icon` is defined: The webapp background color
 * @prop {string} [themeColor=a12fdc] For type `webapp` if `options.icon` is defined: The webapp theme color
 * @prop {string} [publicPath] Like `webpackConfig.publicPath`, but also applies to any plugin
 * @prop {boolean} [excludeLocale=true] Exclude i18n data for `moment`
 * @prop {string} [appDescription]
 * @prop {string} [twitterSiteHandle] For type `webapp`: Twitter handle of the website for the output HTML's meta tags
 * @prop {string} [twitterAuthorHandle] For type `webapp`: Twitter handle of the author for the output HTML's meta tags
 * @prop {string} [locale=en-US] App language
 * @prop {boolean|object} [sitemap=false] For type `webapp`: If `true`, `sitemap-xml-webpack-plugin` will be used to output a `sitemap.xml`. If typeof `object`, this will be used as configuration for SitemapXmlWebpackPlugin constructor.
 * @prop {string} [googleAnalyticsTrackingId] For type `webapp`: If typeof `string`, will be used as the Google Analytics tracking id and resolves any occurence of `GOOGLE_ANALYTICS_TRACKING_ID` to given id
 * @prop {boolean} [googleAnalyticsOnlyInProduction=true] For type `webapp`: If `true`, option `googleAnalyticsTrackingId` will be ignored in any environment but `production`
 * @prop {boolean} [friendlyErrors=false] If `true`, includes `friendly-errors-webpack-plugin`
 * @prop {Object} [cepOptions={}] For type `adobeCep`: Additional option values that will be forwarded to `cep-webpack-plugin` constructor
 * @prop {Object|boolean} [banner = true] If `true`, includes `pkg-banner-webpack-plugin`. If Object, this will be used as plugin options.
 * @prop {Object|boolean} [offline = true] For type `webapp`: If `true`, includes `offline-plugin`. If Object, this will be used as plugin options.
 */

/**
 * Creates Webpack config based on given options
 * @function default
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export default generateWebpackConfig

/**
 * Creates Webpack config based on given options, uses type "cli"
 * @function configureCli
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureCli = options => generateWebpackConfig({
  ...options,
  type: "cli",
})

/**
 * Creates Webpack config based on given options, uses type "nodeLib"
 * @function configureNodeLib
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureNodeLib = options => generateWebpackConfig({
  ...options,
  type: "nodeLib",
})

/**
 * Creates Webpack config based on given options, uses type "nodeClass"
 * @function configureNodeClass
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureNodeClass = options => generateWebpackConfig({
  ...options,
  type: "nodeClass",
})

/**
 * Creates Webpack config based on given options, uses type "universalLib"
 * @function configureUniversalLib
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureUniversalLib = options => generateWebpackConfig({
  ...options,
  type: "universalLib",
})

/**
 * Creates Webpack config based on given options, uses type "universalClass"
 * @function configureUniversalClass
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureUniversalClass = options => generateWebpackConfig({
  ...options,
  type: "universalClass",
})

/**
 * Creates Webpack config based on given options, uses type "webapp"
 * @function configureWebapp
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureWebapp = options => generateWebpackConfig({
  ...options,
  type: "webapp",
})

/**
 * Creates Webpack config based on given options, uses type "nodeScript"
 * @function configureNodeScript
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureNodeScript = options => generateWebpackConfig({
  ...options,
  type: "nodeScript",
})

/**
 * Creates Webpack config based on given options, uses type "photoshopPlugin"
 * @function configurePhotoshopPlugin
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configurePhotoshopPlugin = options => generateWebpackConfig({
  ...options,
  type: "photoshopPlugin",
})

/**
 * Creates Webpack config based on given options, uses type "generatorCorePlugin"
 * @function configureGeneratorCorePlugin
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureGeneratorCorePlugin = options => generateWebpackConfig({
  ...options,
  type: "generatorCorePlugin",
})

/**
 * Creates Webpack config based on given options, uses type "executable"
 * @function configureExecutable
 * @param {WebpackConfigJaidOptions} [options] Given options
 * @returns {object} Webpack configuration object
 */
export const configureExecutable = options => generateWebpackConfig({
  ...options,
  type: "executable",
})