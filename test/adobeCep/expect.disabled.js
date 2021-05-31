import fs from "node:fs"
import path from "node:path"

// Renamed from expect.js to expect.disabled.js
// because compiling expect.js in an webapp test does crash for some reason
exports.default = ({packageOutDir}) => {
  const file = path.join(packageOutDir, "CSXS", "manifest.xml")
  const xml = fs.readFileSync(file, "utf8")
  expect(xml).toMatch("\"jaid.adobeCepExtension.extension\"")
}