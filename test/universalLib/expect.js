import path from "node:path"
import {pathToFileURL} from "node:url"

export default async ({packageOutDir}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  const {default: self} = await import(pathToFileURL(selfFile))
  const result = self()
  expect(result).toBe(123)
}