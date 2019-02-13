export const webpackConfig = () => ({
  target: "node",
  optimization: {
    nodeEnv: false,
  },
  output: {
    filename: "cli.js",
  },
})