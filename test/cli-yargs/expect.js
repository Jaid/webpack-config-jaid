import path from "node:path"

import fss from "@absolunet/fss"
import coffee from "coffee"

export default async ({packageOutDir}) => {
  const self = path.join(packageOutDir, "cli.js")
  const selfContent = fss.readFile(self, "utf8")
  expect(selfContent).toMatch(/^#!\/usr\/bin\/env node/)
  await coffee.fork(self, ["--version"]).expect("code", 0).expect("stdout", /^1.0.0/).end()
  await coffee.fork(self, ["moin"]).expect("code", 0).expect("stdout", /^MOIN$/).end()
  await coffee.fork(self, ["moin", "--color"]).expect("code", 0).expect("stdout", /.+MOIN.+/).end()
}