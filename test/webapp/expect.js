const path = require("path")
const fsExtra = require("fs-extra")

exports.default = ({packageOutDir}) => {
  const indexHmtl = path.join(packageOutDir, "index.html")
  expect(fsExtra.existsSync(indexHmtl)).toBe(true)
}