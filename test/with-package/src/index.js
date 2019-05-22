import ensureStart from "ensure-start"

const getLinkFromDomain = domain => ensureStart(domain, "https://")

export default getLinkFromDomain("jaid.codes")