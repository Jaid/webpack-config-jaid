// const path = require("path")

exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.default({
  packageRoot,
  outDir,
  development,
  // icon: path.join(__dirname, "src", "perk.png"),
})