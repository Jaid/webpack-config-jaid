import immer from "immer"
import {sortBy} from "lodash"

export default licenses => {
  const normalized = licenses.map(license => license.name ? license : immer(draft => {
    draft.name = process.env.REPLACE_PKG_NAME || "Unknown package"
  }))
  const sorted = sortBy(normalized, ({name}) => name)
  const formatted = sorted.map(license => {
    const text = license.licenseText?.trim() || "No license defined."
    const versionString = license.packageJson?.version ? ` ${license.packageJson.version}` : ""
    return `### ${license.name}${versionString}\n\n${text}`
  })
  const joined = formatted.join("\n\n")
  return joined
}