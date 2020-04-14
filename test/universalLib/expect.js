import path from "path"

export default ({packageOutDir}) => {
  const self = require(path.join(packageOutDir, "index.js"))
}