import path from "path"

const webpackConfigJaidPath = path.resolve(__dirname, "..", "dist", "package", "development", "index.js")
console.log("webpack-config-jaid path: " + webpackConfigJaidPath)
const configure = require(webpackConfigJaidPath).default

module.exports = configure({
  packageRoot: __dirname
})