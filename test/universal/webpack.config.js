exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureUniversalLib({
  packageRoot,
  outDir,
  development,
})