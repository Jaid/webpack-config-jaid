import adobeCep from "./adobeCep/index.js"
import cli from "./cli/index.js"
import executable from "./executable/index.js"
import generatorCorePlugin from "./generatorCorePlugin/index.js"
import githubAction from "./githubAction/index.js"
import html from "./html/index.js"
import nodeClass from "./nodeClass/index.js"
import nodeLib from "./nodeLib/index.js"
import nodeScript from "./nodeScript/index.js"
import reactDomComponent from "./reactDomComponent/index.js"
import universalClass from "./universalClass/index.js"
import universalLib from "./universalLib/index.js"
import webapp from "./webapp/index.js"

const types = {
  adobeCep, // adobeCep: require("./adobeCep").default,
  cli, // cli: require("./cli").default,
  executable, // executable: require("./executable").default,
  generatorCorePlugin, // generatorCorePlugin: require("./generatorCorePlugin").default,
  nodeClass, // nodeClass: require("./nodeClass").default,
  githubAction, // githubAction: require("./githubAction").default,
  nodeLib,
  nodeScript,
  universalClass,
  universalLib,
  webapp, // webapp: require("./webapp").default,
  html, // html: require("./html").default,
  reactDomComponent, // reactDomComponent: require("./reactDomComponent").default,
}

export default types