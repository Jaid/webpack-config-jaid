import createDebug from "debug"

const debug = createDebug(process.env.REPLACE_PKG_NAME)

const isCi = Boolean(process.env.TRAVIS_TAG || process.env.GITHUB_WORKFLOW)

debug("Is CI: %s", isCi)

export default isCi