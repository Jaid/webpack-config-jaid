import fss from "@absolunet/fss"
import coffee from "coffee"
import path from "path"

export default async ({packageOutDir}) => {
  const self = path.join(packageOutDir, "cli.js")
  const selfContent = fss.readFile(self, "utf8")
  expect(selfContent).toMatch("#!/usr/bin/env node")
  expect(selfContent).toMatch("process.stdout.write")
  await coffee.fork(self).debug().expect("code", 0).expect("stdout", /^info: +ABC/).end()
}