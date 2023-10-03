import type {PackageJson} from 'type-fest'

import normalizePackageData from 'normalize-package-data'

export default (pkg: PackageJson) => {
  normalizePackageData(pkg)
  return pkg
}
