exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureNodeLib({
  packageRoot,
  outDir,
  development,
})