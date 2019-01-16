/* eslint-disable promise/prefer-await-to-callbacks */

import path from "path"
import fs from "fs"

import webpack from "webpack"

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
      extensions: expect.arrayContaining([".js"]),
    },
    output: {
      filename: "index.js",
    },
  })
  console.log(config)
  webpack(config, (error, stats) => {
    expect(error).toBeNull()
    console.log(stats)
  })
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