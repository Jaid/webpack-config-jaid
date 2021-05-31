import path from "node:path"

export default ({packageOutDir}) => {
  const self = require(path.join(packageOutDir, "index.js"))
  expect(typeof self.default).toBe("function")
  const result = self.default()
  expect(result.rawResult).toBe("<")
  expect(result.htmlResult).toBe("&lt;")
}