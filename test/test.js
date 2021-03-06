import "jest-extended"

import fss from "@absolunet/fss"
import {expect, it} from "@jest/globals"
import {isFunction} from "lodash"
import ms from "ms.macro"
import path from "path"
import pify from "pify"
import readFileYaml from "read-file-yaml"
import readableMs from "readable-ms"
import sortKeys from "sort-keys"

import readableThousands from "../src/lib/readableThousands"

const webpack = pify(require("webpack"))
const getFolderSize = pify(require("get-folder-size"))

const debug = require("debug")("test")

const indexModule = process.env.MAIN ? path.resolve(__dirname, "..", process.env.MAIN) : path.join(__dirname, "..", "src")
const webpackConfigJaid = require(indexModule)

const sizeChanges = []

function addTest(name, meta) {
  const testName = `${name} ${Object.entries(meta).map(entry => `${entry[0]}=${entry[1]}`).join(" ")}`
  it(testName, async () => {
    const packageRoot = path.join(__dirname, name)
    const configPath = path.join(packageRoot, "webpack.config.js")
    const jaidConfigPath = path.join(packageRoot, "jaidConfig.js")
    const expectScriptPath = path.join(packageRoot, "expect.js")
    const outDir = path.join(__dirname, "..", "dist", "test", testName)
    const oldStats = await readFileYaml(path.join(outDir, "benchmark.yml"))
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
      webpackConfig = require(configPath).default(webpackConfigJaid, packageRoot, packageOutDir, development)
    } else {
      let importedJaidConfig = {}
      if (fss.pathExists(jaidConfigPath)) {
        importedJaidConfig = require(jaidConfigPath).default
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
      webpackConfig = webpackConfigJaid.default(jaidConfig)
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
      benchmark.packageBytes = packageSize
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
      expect(statsJson.errors).toEqual([])
      outputObject("stats", statsJson)
    }
    if (fss.pathExists(expectScriptPath)) {
      const selfTest = require(expectScriptPath).default
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
  }, ms`10 minutes`)
}

for (const entry of fss.readdir(__dirname)) {
  const entryPath = path.join(__dirname, entry)
  if (fss.stat(entryPath).isDirectory()) {
    for (const env of ["development", "production"]) {
      addTest(entry, {env})
    }
  }
}

addTest("webapp", {
  env: "development",
  hmr: true,
})

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
    debug("| %s%d B", differenceSymbol, readableThousands(difference))
    debug("| Before: %d B (%d)", readableThousands(before.packageBytes), readableMs(before.ms))
    debug("| After: %d B (%d)", readableThousands(after.packageBytes), readableMs(after.ms))
  }
})