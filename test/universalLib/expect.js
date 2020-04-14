const path = require("path")

exports.default = ({packageOutDir}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  const self = require(selfFile).default
  const result = self()
  expect(result).toBe(123)
}