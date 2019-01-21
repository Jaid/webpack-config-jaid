/* eslint-disable promise/prefer-await-to-callbacks */

import {execSync} from "child_process"
import path from "path"

import fs from "fs-extra"
import pify from "pify"
import webpack from "webpack"
import makeDir from "make-dir"
import coffee from "coffee"

import webpackConfigNode from "../build"

jest.setTimeout(60 * 1000)

const getProjectDir = name => {
  const packageRoot = path.join(__dirname, name)
  const outDir = path.join(packageRoot, "dist", String(Number(new Date)))
  return {
    packageRoot,
    outDir,
  }
}

const compile = async config => {
  const webpackConfig = webpackConfigNode({
    clean: false,
    ...config,
  })
  await makeDir(config.outDir)
  await fs.writeJson(path.join(config.outDir, "config.json"), webpackConfig)
  const stats = (await pify(webpack)(webpackConfig)).toJson()
  await fs.writeJson(path.join(config.outDir, "stats.json"), stats)
  return {
    webpackConfig,
    stats,
  }
}

it("should build a basic project in dev mode", async () => {
  const {packageRoot, outDir} = getProjectDir("basic")
  const {stats, webpackConfig} = await compile({
    packageRoot,
    outDir,
  })
  expect(webpackConfig).toMatchObject({
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
  expect(stats).toMatchObject({
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
  await compile({
    packageRoot,
    outDir,
    development: false,
  })
  const builtLib = require(outDir).default
  expect(typeof builtLib).toBe("function")
  expect(builtLib()).toBe(123)
})

it("should build a project that uses a lib that is also built with webpack-config-jaid", async () => {
  const {packageRoot: libPackageRoot, outDir: libOutDir} = getProjectDir("basic")
  await compile({
    packageRoot: libPackageRoot,
    outDir: libOutDir,
    development: false,
  })
  const packageRoot = path.join(libOutDir, "nested")
  const outDir = path.join(packageRoot, "dist")
  await makeDir(path.join(packageRoot, "src"))
  fs.writeJsonSync(path.join(packageRoot, "package.json"), {
    name: "webpack-config-jaid-test-nested",
    version: "1.0.0",
    author: "Jaid",
  })
  fs.writeFileSync(path.join(packageRoot, "src", "index.js"), "import lib from \"../..\"\nexport default x => 2 * lib()")
  await compile({
    packageRoot,
    outDir,
  })
  const builtLib = require(outDir).default
  expect(typeof builtLib).toBe("function")
  expect(builtLib(2)).toBe(246)
})

it("should build a cli project with publishimo support", async () => {
  const {packageRoot, outDir} = getProjectDir("cli-publishimo")
  await compile({
    packageRoot,
    outDir,
    development: false,
    type: "cli",
    include: ["license.txt"],
    publishimo: {
      publishimoOptions: {
        author: {
          name: "Jaid",
          github: true,
        },
      },
    },
  })
  const pkg = require(path.join(outDir, "package.json"))
  expect(pkg).toMatchObject({
    name: "cli-publishimo",
    version: "9.9.9",
    bin: "index.js",
    author: {
      name: "Jaid",
      url: "https://github.com/Jaid",
    },
    bugs: "https://github.com/Jaid/cli-publishimo/issues",
    homepage: "https://github.com/Jaid/cli-publishimo#readme",
    repository: "github:Jaid/cli-publishimo",
  })
  const license = fs.readFileSync(path.join(outDir, "license.txt"), "utf8")
  expect(license).toMatch("Copyright")
  return coffee.fork(outDir)
    .expect("stdout", "ABC")
    .expect("code", 0)
    .end()
})

describe("should build a project with some external dependencies", () => {
  const packageRoot = path.join(__dirname, "depender")
  if (!fs.existsSync(path.join(packageRoot, "node_modules"))) {
    execSync(`cd "${packageRoot}" && npm install`)
  }
  for (const env of ["development", "production"]) {
    it(`for ${env} environment`, async () => {
      const {outDir} = getProjectDir("depender")
      await compile({
        packageRoot,
        outDir,
        type: "cli",
        development: env !== "production",
      })
      return coffee.fork(outDir)
        .expect("stdout", "My name is valid!\n")
        .expect("code", 0)
        .end()
    })
  }
})