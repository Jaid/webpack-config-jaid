import path from "node:path"

export default async ({packageOutDir}) => {
  const {default: self} = await import(path.join(packageOutDir, "index.js"))
  expect(typeof self).toBe("function")
  const result = self()
  expect(result).toBe(123)
}