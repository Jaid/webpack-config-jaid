import webpackMerge from "webpack-merge"

export default (...webpackConfigs) => {
  return webpackMerge.smart(...webpackConfigs)
}