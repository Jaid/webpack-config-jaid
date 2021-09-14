import path from "node:path"
import fs from "node:fs/promises"

export default async ({packageOutDir}) => {
  const indexPath = path.join(packageOutDir, "index.js")
  const selfText = await fs.readFile(indexPath, "utf8")
  expect(selfText).toMatch("https://")
  expect(selfText).toMatch("require(")
  const {default: self} = await import(indexPath)
  expect(typeof self).toBe("string")
  expect(self).toBe("https://jaid.codes")
}