exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureExecutable({
  packageRoot,
  outDir,
  development,
})