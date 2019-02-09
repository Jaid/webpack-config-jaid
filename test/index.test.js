/* eslint-disable promise/prefer-await-to-callbacks */

import path from "path"

import fss from "@absolunet/fss"
import pify from "pify"
import sortKeys from "sort-keys"

const webpack = pify(require("webpack"))
const getFolderSize = pify(require("get-folder-size"))

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src"))
const webpackConfigJaid = require(indexModule)

const setupTest = (name, packageRoot) => {
  const timeout = 60 * 1000
  describe(name, () => {
    for (const env of ["development", "production"]) {
      it(env, async () => {
        const configPath = path.join(packageRoot, "webpack.config.js")
        const expectScriptPath = path.join(packageRoot, "expect.js")
        const outDir = path.join(__dirname, "..", "dist", "test", `${name}-${env}`)
        const packageOutDir = path.join(outDir, "package")
        const outputObject = (key, value) => fss.outputJson5(path.join(outDir, `${key}.json5`), sortKeys(value, {deep: true}), {space: 2})
        const development = env !== "production"
        const startTime = Date.now()
        let webpackConfig
        if (fss.pathExists(configPath)) {
          webpackConfig = require(configPath).default(webpackConfigJaid, packageRoot, packageOutDir, development)
        } else {
          webpackConfig = webpackConfigJaid.configureLib({
            packageRoot,
            development,
            outDir: packageOutDir,
          })
        }
        outputObject("webpack.config", webpackConfig)
        const stats = await webpack(webpackConfig)
        const benchmark = {
          seconds: (Date.now() - startTime) / 1000,
        }
        try {
          const packageSize = await getFolderSize(packageOutDir)
          benchmark.packageKb = packageSize / 1000
          benchmark.codeKb = fss.stat(path.join(packageOutDir, "index.js")).size / 1000
        } catch {}
        outputObject("benchmark", benchmark)
        const statsJson = stats.toJson()
        outputObject("stats", statsJson)
        if (fss.pathExists(expectScriptPath)) {
          const selfTest = require(expectScriptPath)
          selfTest.default({
            name,
            packageRoot,
            stats,
            benchmark,
            webpackConfig,
            outDir,
            packageOutDir,
          })
        }
      }, timeout)
    }
  })
}

for (const entry of fss.readdir(__dirname)) {
  const entryPath = path.join(__dirname, entry)
  if (fss.stat(entryPath).isDirectory()) {
    setupTest(entry, entryPath)
  }
}