import path from "node:path"
import fs from "node:fs/promises"

const nodeEnv = typeof __webpack_runtime_id__ === "string" ? "development" : "production"
const file = path.join(process.cwd(), "dist", "test", `nodeScript env=${nodeEnv}`, "testFile.json")

const json = JSON.stringify({
  date: Date.now(),
  env: nodeEnv,
})
await fs.writeFile(file, json)