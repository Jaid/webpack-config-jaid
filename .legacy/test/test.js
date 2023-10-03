import "jest-extended"

import path from "node:path"
import {fileURLToPath, pathToFileURL} from "node:url"
import {promisify} from "node:util"

import fss from "@absolunet/fss"
import createDebug from "debug"
import getFolderSize from "get-folder-size"
import {isFunction} from "lodash-es"
import readFileYaml from "read-file-yaml"
import sortKeys from "sort-keys"
import webpackModule from "webpack"

import readableMs from "../src/lib/esm/readable-ms.js"
import readableThousands from "../src/lib/readableThousands.js"

const disabledTests = ["webapp"]

const webpack = promisify(webpackModule)

const debug = createDebug("test")
const dirName = path.dirname(fileURLToPath(import.meta.url))
const indexPath = process.env.MAIN ? path.resolve(dirName, "..", process.env.MAIN) : path.join(dirName, "..", "src", "index.js")
debug("Testing build: %s", indexPath)
const {default: webpackConfigJaid} = await import(pathToFileURL(indexPath))

const sizeChanges = []

const runTest = async (name, testId, meta) => {
  const startTime = Date.now()
  const benchmark = {}
  debug("Running test: %s", testId)
  const packageRoot = path.join(dirName, name)
  const configPath = path.join(packageRoot, "webpack.config.js")
  const jaidConfigPath = path.join(packageRoot, "jaidConfig.js")
  const expectScriptPath = path.join(packageRoot, "expect.js")
  const outDir = path.join(dirName, "..", "dist", "test", testId)
  const oldStats = await readFileYaml.default(path.join(outDir, "benchmark.yml"))
  const packageOutDir = path.join(outDir, "package")
  const outputObject = (key, value) => {
    if (!value) {
      value = {}
    }
    try {
      value = sortKeys(value, {deep: true})
    } catch (error) {
      debug("Can't sort object %s", key)
    }
    const yamlFile = path.join(outDir, `${key}.yml`)
    try {
      fss.outputYaml(yamlFile, value)
    } catch {
      const file = path.join(outDir, `${key}.json5`)
      fss.outputJson5(file, value, {space: 2})
      const input = fss.readJson5(file)
      fss.outputYaml(yamlFile, input)
      fss.remove(file)
    }
  }
  const development = meta.env !== "production"
  let webpackConfig
  if (fss.pathExists(configPath)) {
    debug("Using custom webpack config: %s", configPath)
    const webpackConfigModule = await import(pathToFileURL(configPath))
    webpackConfig = webpackConfigModule.default(webpackConfigJaid, packageRoot, packageOutDir, development)
  } else {
    debug("Using generated webpack config")
    let importedJaidConfig = {}
    if (fss.pathExists(jaidConfigPath)) {
      debug("Using custom jaidConfig: %s", jaidConfigPath)
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
    const forcedOptions = {
      packageRoot,
      development,
      outDir: packageOutDir,
    }
    const jaidConfig = {
      ...forcedOptions,
      ...importedJaidConfig,
    }
    if (jaidConfig.subPackages) {
      for (const options of Object.values(jaidConfig.subPackages)) {
        options.packageRoot = options.packageRoot ?? forcedOptions.packageRoot
        options.development = options.development ?? forcedOptions.development
        options.outDir = options.outDir ?? forcedOptions.outDir
      }
    }
    outputObject("jaidConfig", jaidConfig)
    const webpackConfigJaidStart = Date.now()
    webpackConfig = webpackConfigJaid(jaidConfig)
    benchmark.timeWebpackConfigJaid = Date.now() - webpackConfigJaidStart
  }
  outputObject("webpack.config", webpackConfig)
  let stats
  const compileStartTime = Date.now()
  if (!meta.hmr) {
    stats = await webpack(webpackConfig)
  }
  const dateNow = Date.now()
  benchmark.timeTotal = dateNow - startTime
  benchmark.timeWebpackCompile = dateNow - compileStartTime
  debug("Webpack compile time: %d ms", benchmark.timeWebpackCompile)
  if (fss.pathExists(expectScriptPath)) {
    debug("Running expect script:", expectScriptPath)
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
  try {
    const packageSize = await getFolderSize(packageOutDir)
    benchmark.packageBytes = packageSize.size
    benchmark.codeBytes = fss.stat(path.join(packageOutDir, "index.js")).size
  } catch {}
  if (oldStats?.packageBytes) {
    if (benchmark.packageBytes !== oldStats.packageBytes) {
      sizeChanges.push({
        name: testId,
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
}

function addTest(name, meta) {
  const testId = `${name} ${Object.entries(meta).map(entry => `${entry[0]}=${entry[1]}`).join(" ")}`
  it(testId, async () => {
    await runTest(name, testId, meta)
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
    debug("|  After: %s B (%s)", readableThousands(after.packageBytes), readableMs(after.ms))
  }
})