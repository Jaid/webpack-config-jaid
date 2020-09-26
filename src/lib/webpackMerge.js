import webpackMerge from "webpack-merge"

export default (...webpackConfigs) => {
  const merged = webpackMerge(...webpackConfigs)
  return merged
}