const debug = require("debug")(_PKG_NAME)


export default Boolean(process.env.TRAVIS_TAG || process.env.GITHUB_WORKFLOW)