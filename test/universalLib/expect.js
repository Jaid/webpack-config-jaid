const path = require("path")

exports.default = ({packageOutDir}) => {
  const self = require(path.join(packageOutDir, "index.js")).default
  const result = self()
  expect(result).toBe(123)
}