import fs from "node:fs"
import path from "node:path"

exports.default = ({packageOutDir}) => {
  const indexPath = path.join(packageOutDir, "index.js")
  const selfText = fs.readFileSync(indexPath, "utf8")
  expect(selfText).toMatch("process.env.MAIN")
  expect(selfText).toMatch("process.env.NODE_ENV")
}