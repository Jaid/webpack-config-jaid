import {isObject, compact} from "lodash"
import stringifyAuthor from "stringify-author"

const copyrightString = "Copyright ©"

export default class Credits {

  constructor(pkg) {
    this.pkg = pkg
  }

  getPackageName() {
    if (this.pkg.version) {
      return `${this.pkg.name} ${this.pkg.version}`
    } else {
      return this.pkg.name
    }
  }

  getCopyright() {
    const year = (new Date).getFullYear()
    const prefix = `${copyrightString} ${year},`
    if (isObject(this.pkg.author)) {
      const author = stringifyAuthor(this.pkg.author)
      return `${prefix} ${author}`
    } else {
      return prefix
    }
  }

  getLicense() {
    const license = this.pkg.license
    if (!license) {
      return null
    }
    return `Licensed under ${this.pkg.license}`
  }

  getHomepage() {
    if (this.pkg.homepage) {
      return `See ${this.pkg.homepage}`
    }
    if (this.pkg.author ?.url) {
      return `See ${this.pkg.author.url}`
    }
    return null
  }

  toString() {
    return compact([
      this.getPackageName(),
      this.getCopyright(),
      this.getLicense(),
      this.getHomepage(),
    ]).join("\n")
  }

}