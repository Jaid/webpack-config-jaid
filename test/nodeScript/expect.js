const path = require("path")
const fs = require("fs-extra")

exports.default = ({packageOutDir, outDir, expect}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  require(selfFile)
  const writtenFile = path.join(outDir, "testFile.json")
  const json = fs.readJsonSync(writtenFile)
  expect(json.date).toBeGreaterThan(0)
  expect(typeof json.env).toBe("string")
}