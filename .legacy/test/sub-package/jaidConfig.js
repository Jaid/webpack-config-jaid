import path from "node:path"

export default ({outDir}) => {
  return {
    clean: false,
    subPackages: {
      mySite: {
        type: "html",
        outDir: path.join(outDir, "sub"),
      },
    },
  }
}