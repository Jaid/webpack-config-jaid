const path = require("path")

exports.default = ({packageOutDir}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  require(selfFile)
}