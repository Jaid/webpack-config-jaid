export const defaultOptions = () => ({
  hashbang: "/usr/bin/env node",
})

export const webpackConfig = () => ({
  target: "node",
  optimization: {
    nodeEnv: false,
  },
  node: {
    __dirname: false,
    __filename: false,
    process: false,
    Buffer: false,
    setImmediate: false,
  },
  output: {
    filename: "cli.js",
  },
})