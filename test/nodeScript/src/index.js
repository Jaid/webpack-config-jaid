const nodeEnv = typeof __webpack_runtime_id__ === "string" ? "development" : "production"
const file = require("path").join(process.cwd(), "dist", "test", `nodeScript env=${nodeEnv}`, "testFile.json")

const json = JSON.stringify({
  date: Date.now(),
  env: nodeEnv,
})
require("fs").writeFileSync(file, json)