import path from "node:path"

export default async ({packageOutDir}) => {
  const selfFile = path.join(packageOutDir, "index.js")
  const {default: self} = await import(selfFile)
  const result = self()
  expect(result).toBe(123)
}