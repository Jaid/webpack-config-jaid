const debug = require("debug")(_PKG_NAME)

const isCi = Boolean(process.env.TRAVIS_TAG || process.env.GITHUB_WORKFLOW)

debug(`Is CI: ${isCi}`)

export default isCi