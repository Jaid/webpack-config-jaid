import ensureStart from "lib/esm/ensure-start.js"

const getLinkFromDomain = domain => ensureStart(domain, "https://")

export default getLinkFromDomain("jaid.codes")