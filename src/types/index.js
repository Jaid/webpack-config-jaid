import nodeLib from "./nodeLib/index.js"
import nodeScript from "./nodeScript/index.js"
import universalClass from "./universalClass/index.js"
import universalLib from "./universalLib/index.js"

const types = {
  // adobeCep: require("./adobeCep").default,
  // cli: require("./cli").default,
  // executable: require("./executable").default,
  // generatorCorePlugin: require("./generatorCorePlugin").default,
  // nodeClass: require("./nodeClass").default,
  // githubAction: require("./githubAction").default,
  nodeLib,
  nodeScript,
  universalClass,
  universalLib,
  // webapp: require("./webapp").default,
  // html: require("./html").default,
  // reactDomComponent: require("./reactDomComponent").default,
}

export default types