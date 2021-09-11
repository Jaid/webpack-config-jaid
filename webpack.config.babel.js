import configure from "./src/index.js"

export default configure({
  documentation: {babel: true},
  publishimo: true,
  configOutput: true,
  include: [
    "readme.*",
    "license.*",
    "assets.d.ts",
  ],
})