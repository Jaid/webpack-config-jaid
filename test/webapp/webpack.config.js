const path = require("path")

exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureWebapp({
  packageRoot,
  outDir,
  development,
  backgroundColor: "13061b",
  icon: path.join(__dirname, "src", "perk.png")
})