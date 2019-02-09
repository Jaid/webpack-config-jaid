const path = require("path")
const fs = require("fs")

exports.default = ({packageOutDir}) => {
  const indexPath = path.join(packageOutDir, "index.js")
  const selfText = fs.readFileSync(indexPath, "utf8")
  expect(selfText).toMatch("require(\"lodash\")")
  const self = require(indexPath)
  expect(typeof self.default).toBe("string")
  expect(self.default).toBe("123")
}