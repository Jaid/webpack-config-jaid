const debug = require("debug")(process.env.REPLACE_PKG_NAME)

const isCi = Boolean(process.env.TRAVIS_TAG || process.env.GITHUB_WORKFLOW)

debug(`Is CI: ${isCi}`)

export default isCi