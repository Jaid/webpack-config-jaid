import path from "node:path"
import {pathToFileURL} from "node:url"

export default async ({packageOutDir}) => {
  const {default: self} = await import(pathToFileURL(path.join(packageOutDir, "index.js")))
  expect(typeof self).toBe("function")
  const result = self()
  expect(result).toBe(123)
}