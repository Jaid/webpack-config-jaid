/* eslint-disable promise/prefer-await-to-callbacks */

import path from "path"

import fs from "fs-extra"
import pify from "pify"
import webpack from "webpack"
import makeDir from "make-dir"

import webpackConfigNode from "../build"

const getProjectDir = name => {
  const packageRoot = path.join(__dirname, name)
  const outDir = path.join(packageRoot, "dist", String(Number(new Date)))
  return {
    packageRoot,
    outDir,
  }
}

it("should build a basic project", async () => {
  const {packageRoot, outDir} = getProjectDir("basic")
  expect(fs.existsSync(path.join(packageRoot, "src/index.js"))).toBeTruthy()
  const config = webpackConfigNode({
    packageRoot,
    outDir,
  })
  expect(config).toMatchObject({
    target: "node",
    mode: "development",
    module: {
      rules: expect.arrayContaining([
        {
          test: /\.js$/,
          exclude: /node_modules\//,
          loader: "babel-loader",
        },
      ]),
    },
    resolve: {
      extensions: expect.arrayContaining([".js", ".json"]),
    },
    output: {
      filename: "index.js",
    },
  })
  const stats = await pify(webpack)(config)
  const statsJson = stats.toJson()
  fs.outputJsonSync(path.join(outDir, "stats.json"), statsJson)
  expect(statsJson).toMatchObject({
    errors: [],
    warnings: [],
    hash: expect.stringMatching(/[\da-z]+/),
    assetsByChunkName: {
      main: "index.js",
    },
    assets: [
      {
        name: "index.js",
        chunks: ["main"],
        chunkNames: ["main"],
        emitted: true,
      },
    ],
  })
  const builtLib = require(outDir).default
  expect(typeof builtLib).toBe("function")
  expect(builtLib()).toBe(123)
})

it("should build a basic project in prod mode", async () => {
  const {packageRoot, outDir} = getProjectDir("basic")
  const config = webpackConfigNode({
    packageRoot,
    outDir,
    isDevelopment: false,
  })
  await pify(webpack)(config)
  const builtLib = require(outDir).default
  expect(typeof builtLib).toBe("function")
  expect(builtLib()).toBe(123)
})

it("should build a project that uses a lib that is also built with webpack-config-node", async () => {
  const {packageRoot: libPackageRoot, outDir: libOutDir} = getProjectDir("basic")
  const libConfig = webpackConfigNode({
    packageRoot: libPackageRoot,
    outDir: libOutDir,
    isDevelopment: false,
  })
  await pify(webpack)(libConfig)
  const packageRoot = path.join(libOutDir, "nested")
  const outDir = path.join(packageRoot, "dist")
  await makeDir(path.join(packageRoot, "src"))
  fs.writeJsonSync(path.join(packageRoot, "package.json"), {
    name: "webpack-config-node-test-nested",
    version: "1.0.0",
    author: "Jaid",
  })
  fs.writeFileSync(path.join(packageRoot, "src", "index.js"), "import lib from \"../..\"\nexport default x => 2 * lib()")
  const config = webpackConfigNode({
    packageRoot,
    outDir,
isDevelopment: false,

  })
  await pify(webpack)(config)
  const builtLib = require(outDir).default
  expect(typeof builtLib).toBe("function")
  expect(builtLib(2)).toBe(246)
})

// it("should build a lib", callback => {
//   const dir = getProjectDir("lib")
//   const config = webpackConfigNode({
//     packageRoot: dir,
//   })
//   webpack(config, (error, stats) => {
//     callback()
//   })
// })