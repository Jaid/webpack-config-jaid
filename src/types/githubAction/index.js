import {configureNode, commonTerserOptions} from "src/configFragments"

export const defaultOptions = () => ({
  terserOptions: {
    ...commonTerserOptions,
    toplevel: true,
  },
  include: false,
  nodeExternals: false,
  outDir: "build",
  licenseFileName: false,
})

export const webpackConfig = () => configureNode({
  resolve: {
    mainFields: ["main", "module"],
  },
})