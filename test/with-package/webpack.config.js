exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.default({
  packageRoot,
  outDir,
  development,
  terserOptions: false
})