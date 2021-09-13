const path = require("path")

export default ({outDir}) => {
  return {
    type: "nodeLib",
    documentation: {
      tsdOutputFile: path.join(outDir, "types.d.ts"),
      htmlOutputDir: path.resolve(outDir, "..", "homepage"),
    },
  }
}