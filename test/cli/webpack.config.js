exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureCli({
  packageRoot,
  outDir,
  development,
  publishimo: true,
})