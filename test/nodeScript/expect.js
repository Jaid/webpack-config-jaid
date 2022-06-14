import path from "node:path"
import {pathToFileURL} from "node:url"

import delay from "delay"
import fs from "fs-extra"

export default async ({packageOutDir, outDir, expect}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  await import(pathToFileURL(selfFile))
  await delay(1000) // Wait until script is done writing testFile.json
  const writtenFile = path.join(outDir, "testFile.json")
  const json = await fs.readJson(writtenFile)
  expect(json.date).toBeGreaterThan(0)
  expect(typeof json.env).toBe("string")
}