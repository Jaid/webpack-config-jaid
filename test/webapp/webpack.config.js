exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureWebapp({
  packageRoot,
  outDir,
  development,
  includeMonacoEditor: true,
})