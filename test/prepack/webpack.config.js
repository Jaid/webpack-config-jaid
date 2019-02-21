// const {default: PrepackWebpackPlugin} = require("prepack-webpack-plugin")

exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureUniversalLib({
  packageRoot,
  outDir,
  development,
  extra: {
    // plugins: [new PrepackWebpackPlugin],
  },
})