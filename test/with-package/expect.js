import fs from "node:fs/promises"
import path from "node:path"
import {pathToFileURL} from "node:url"

export default async ({packageOutDir}) => {
  const indexPath = path.join(packageOutDir, "index.js")
  const selfText = await fs.readFile(indexPath, "utf8")
  expect(selfText).toMatch("https://")
  expect(selfText).toMatch(/from ?"ensure-start"/)
  const {default: self} = await import(pathToFileURL(indexPath))
  expect(typeof self).toBe("string")
  expect(self).toBe("https://jaid.codes")
}