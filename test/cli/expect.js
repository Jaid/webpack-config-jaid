import path from "path"

import coffee from "coffee"

export default ({packageOutDir}) => {
  const self = path.join(packageOutDir, "cli.js")
  coffee.fork(self).expect("code", 0).end()
}