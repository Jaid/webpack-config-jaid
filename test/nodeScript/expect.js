import path from "node:path"

import fs from "fs-extra"

export default async ({packageOutDir, outDir, expect}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  await import(selfFile)
  const writtenFile = path.join(outDir, "testFile.json")
  const json = await fs.readJson(writtenFile)
  expect(json.date).toBeGreaterThan(0)
  expect(typeof json.env).toBe("string")
}