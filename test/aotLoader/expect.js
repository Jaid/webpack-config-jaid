import path from "node:path"

export default async ({packageOutDir}) => {
  const {default: self} = await import(path.join(packageOutDir, "index.js"))
  // TODO This is disabled, because it actually doesn't use aot-loader anymore
  // expect(typeof self).toBe("function")
  // const result = self()
  // expect(result).toBe(123)
}