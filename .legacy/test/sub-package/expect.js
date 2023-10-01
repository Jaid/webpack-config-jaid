import path from "node:path"

import fs from "fs-extra"

export default async ({packageOutDir}) => {
  const indexPath = path.join(packageOutDir, "index.js")
  const indexStats = await fs.stat(indexPath)
  expect(indexStats.size).toBeGreaterThan(0)

  const subIndexPath = path.join(packageOutDir, "sub", "index.js")
  const subIndexStats = await fs.stat(subIndexPath)
  expect(subIndexStats.size).toBeGreaterThan(0)

  const subHtmlPath = path.join(packageOutDir, "sub", "index.html")
  const subHtmlStats = await fs.stat(subHtmlPath)
  expect(subHtmlStats.size).toBeGreaterThan(0)
}