import path from "path"
import fs from "fs"

exports.default = ({packageOutDir}) => {
  const indexPath = path.join(packageOutDir, "index.js")
  const selfText = fs.readFileSync(indexPath, "utf8")
  expect(selfText).toMatch("process.env.MAIN")
  expect(selfText).toMatch("process.env.NODE_ENV")
}