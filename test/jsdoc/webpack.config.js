const path = require("path")

exports.default = (webpackConfigJaid, packageRoot, outDir, development) => webpackConfigJaid.configureLibClass({
  packageRoot,
  outDir,
  development,
  documentation: {
    tsdOutputFile: path.join(outDir, "types.d.ts"),
    htmlOutputDir: path.resolve(outDir, "..", "homepage"),
  },
})