import {LibConfigBuilder} from './LibConfigBuilder.js'

const buildConfig = async () => {
  const configBuilder = new LibConfigBuilder
  const webpackConfig = await configBuilder.build()
  console.dir(configBuilder)
  return webpackConfig
}

export default buildConfig
export {buildConfig}
