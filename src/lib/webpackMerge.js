import webpackMerge from "webpack-merge"

export default (...webpackConfigs) => {
  const config1 = webpackConfigs[0]
  const config2 = webpackConfigs[1]
  // const mergedSmart = webpackMerge.smart(...webpackConfigs)
  const merged = webpackMerge(...webpackConfigs)
  return merged
}