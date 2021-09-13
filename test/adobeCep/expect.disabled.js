import fs from "fs"
import path from "path"

// Renamed from expect.js to expect.disabled.js
// because compiling expect.js in an webapp test does crash for some reason
export default ({packageOutDir}) => {
  const file = path.join(packageOutDir, "CSXS", "manifest.xml")
  const xml = fs.readFileSync(file, "utf8")
  expect(xml).toMatch("\"jaid.adobeCepExtension.extension\"")
}