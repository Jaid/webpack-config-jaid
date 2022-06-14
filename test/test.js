import "jest-extended"

import path from "node:path"
import {fileURLToPath, pathToFileURL} from "node:url"

import fss from "@absolunet/fss"
import createDebug from "debug"
import getFolderSize from "get-folder-size"
import {isFunction} from "lodash-es"
import pify from "pify"
import readFileYaml from "read-file-yaml"
import sortKeys from "sort-keys"
import webpackModule from "webpack"

import readableMs from "../src/lib/esm/readable-ms.js"
import readableThousands from "../src/lib/readableThousands.js"

const disabledTests = ["webapp"]

const webpack = pify(webpackModule)

const debug = createDebug("test")
const dirName = path.dirname(fileURLToPath(import.meta.url))
const indexPath = process.env.MAIN ? path.resolve(dirName, "..", process.env.MAIN) : path.join(dirName, "..", "src", "index.js")
debug("Testing build: %s", indexPath)
const {default: webpackConfigJaid} = await import(pathToFileURL(indexPath))

const sizeChanges = []

function addTest(name, meta) {
  const testName = `${name} ${Object.entries(meta).map(entry => `${entry[0]}=${entry[1]}`).join(" ")}`
  it(testName, async () => {
    const packageRoot = path.join(dirName, name)
    const configPath = path.join(packageRoot, "webpack.config.js")
    const jaidConfigPath = path.join(packageRoot, "jaidConfig.js")
    const expectScriptPath = path.join(packageRoot, "expect.js")
    const outDir = path.join(dirName, "..", "dist", "test", testName)
    const oldStats = await readFileYaml.default(path.join(outDir, "benchmark.yml"))
    const packageOutDir = path.join(outDir, "package")
    const outputObject = (key, value) => {
      const sortedObject = sortKeys(value, {deep: true})
      try {
        const file = path.join(outDir, `${key}.yml`)
        fss.outputYaml(file, sortedObject)
      } catch {
        const file = path.join(outDir, `${key}.json5`)
        fss.outputJson5(file, sortedObject, {space: 2})
      }
    }
    const development = meta.env !== "production"
    const startTime = Date.now()
    let webpackConfig
    if (fss.pathExists(configPath)) {
      const webpackConfigModule = await import(pathToFileURL(configPath))
      webpackConfig = webpackConfigModule.default(webpackConfigJaid, packageRoot, packageOutDir, development)
    } else {
      let importedJaidConfig = {}
      if (fss.pathExists(jaidConfigPath)) {
        const importedJaidConfigModule = await import(pathToFileURL(jaidConfigPath))
        importedJaidConfig = importedJaidConfigModule.default
        if (isFunction(importedJaidConfig)) {
          importedJaidConfig = importedJaidConfig({
            packageRoot,
            outDir: packageOutDir,
            development,
            meta,
          })
        }
      }
      const jaidConfig = {
        packageRoot,
        development,
        outDir: packageOutDir,
        ...importedJaidConfig,
      }
      outputObject("jaidConfig", jaidConfig)
      webpackConfig = webpackConfigJaid(jaidConfig)
    }
    outputObject("webpack.config", webpackConfig)
    let stats
    if (!meta.hmr) {
      stats = await webpack(webpackConfig)
    }
    const benchmark = {
      ms: Date.now() - startTime,
    }
    try {
      const packageSize = await getFolderSize(packageOutDir)
      benchmark.packageBytes = packageSize.size
      benchmark.codeBytes = fss.stat(path.join(packageOutDir, "index.js")).size
    } catch {}
    if (oldStats?.packageBytes) {
      if (benchmark.packageBytes !== oldStats.packageBytes) {
        sizeChanges.push({
          name: testName,
          before: oldStats,
          after: benchmark,
        })
      }
    }
    outputObject("benchmark", benchmark)
    if (stats) {
      const statsJson = stats.toJson()
      if (statsJson.errors.length) {
        throw statsJson.errors[0]
      }
      expect(statsJson.errors).toEqual([])
      outputObject("stats", statsJson)
    }
    if (fss.pathExists(expectScriptPath)) {
      const {default: selfTest} = await import(pathToFileURL(expectScriptPath))
      await selfTest({
        name,
        packageRoot,
        stats,
        benchmark,
        webpackConfig,
        outDir,
        packageOutDir,
        expect,
        development,
        meta,
      })
    }
  }, 1000 * 60 * 5) // 5 minutes
}

for (const entry of fss.readdir(dirName)) {
  if (disabledTests.includes(entry)) {
    continue
  }
  const entryPath = path.join(dirName, entry)
  if (fss.stat(entryPath).isDirectory()) {
    for (const env of ["development", "production"]) {
      addTest(entry, {env})
    }
  }
}

if (!disabledTests.includes("webapp")) {
  addTest("webapp", {
    env: "development",
    hmr: true,
  })
}

afterAll(() => {
  for (const {name, before, after} of sizeChanges) {
    const difference = Math.abs(before.packageBytes - after.packageBytes)
    let differenceSymbol
    let changeWord
    if (after.packageBytes > before.packageBytes) {
      differenceSymbol = "+"
      changeWord = "larger"
    } else {
      differenceSymbol = "-"
      changeWord = "smaller"
    }
    debug("%s got %s:", name, changeWord)
    debug("| %s%s B", differenceSymbol, readableThousands(difference))
    debug("| Before: %s B (%s)", readableThousands(before.packageBytes), readableMs(before.ms))
    debug("| After: %s B (%s)", readableThousands(after.packageBytes), readableMs(after.ms))
  }
})