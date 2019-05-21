import {configureNode} from "src/configFragments"

export const defaultOptions = () => ({
  nodeExternals: false,
  terserOptions: {
    toplevel: true,
    compress: {
      passes: 5,
      unsafe: true,
      drop_console: true,
    },
    output: {
      ecma: 8,
    },
  },
})

export const webpackConfig = () => configureNode({
  output: {
    filename: "app.js",
  },
})