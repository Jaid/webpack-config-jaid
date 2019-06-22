const path = require("path")

exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureWebapp({
  packageRoot,
  outDir,
  development,
  icon: path.join(__dirname, "src", "perk.png")
})