export const defaultOptions = () => ({
  hashbang: "/usr/bin/env node",
})

export const webpackConfig = () => ({
  target: "node",
  optimization: {
    nodeEnv: false,
  },
  output: {
    filename: "cli.js",
  },
})