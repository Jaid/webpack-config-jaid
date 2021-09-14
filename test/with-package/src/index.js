import ensureStartModule from "ensure-start"

const ensureStart = ensureStartModule.default // TODO Remove again after ESM migration

const getLinkFromDomain = domain => ensureStart(domain, "https://")

export default getLinkFromDomain("jaid.codes")