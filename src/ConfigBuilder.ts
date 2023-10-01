import type {Class, PackageJson} from 'type-fest'
import type {Configuration, RuleSetCondition, RuleSetUse, WebpackPluginInstance} from 'webpack'

import path from 'node:path'

import * as lodash from 'lodash-es'
import {AdditiveOperator} from 'typescript'

export type Key = string
export type Env = "development" | "production"
export type BaseOptions = {
  contextFolder: string
  env: Env
  outputFolder: string
}
export type TesterInput = RegExp | string | string[]
export type PluginInput = Class<WebpackPluginInstance> | WebpackPluginInstance

const compileTester = (testerInput: TesterInput): RuleSetCondition => {
  if (testerInput instanceof RegExp) {
    return testerInput
  }
  if (Array.isArray(testerInput)) {
    const insertion = testerInput.join(`|`)
    return new RegExp(`\\.(${insertion})$`)
  }
  return new RegExp(`\\.${testerInput}$`)
}
export class ConfigBuilder<OptionsGeneric = {}, BaseOptionsGeneric = BaseOptions> {
  protected config: Configuration = {}
  protected contextFolder: string
  protected mode: "none" | Env
  protected options: OptionsGeneric
  protected outputFolder: string
  #isProduction: boolean
  constructor(options: Partial<OptionsGeneric> = {}) {
    const defaultOptions = this.getDefaultOptions()
    const mergedOptions = this.mergeOptions(options, defaultOptions)
    const finalOptions = <BaseOptions> (this.normalizeOptions(mergedOptions) ?? mergedOptions)
    this.options = <OptionsGeneric> finalOptions
    this.#isProduction = finalOptions.env === `production`
    this.mode = this.#isProduction ? `production` : `development`
    this.outputFolder = path.resolve(finalOptions.outputFolder)
    this.contextFolder = path.resolve(finalOptions.contextFolder)
  }
  get isDevelopment() {
    return !this.#isProduction
  }
  get isProduction() {
    return this.#isProduction
  }
  get webpackConfig() {
    return this.config
  }
  addClassOrInstance(key: Key, plugin: PluginInput, options?: unknown) {
    let instance: WebpackPluginInstance
    if (lodash.isFunction(plugin)) {
      const Plugin = <Class<WebpackPluginInstance>> <unknown> plugin
      if (options !== undefined) {
        instance = new Plugin(options)
      } else {
        instance = new Plugin
      }
    } else {
      instance = plugin
    }
    this.append(key, instance)
  }
  addExtension(extension: string) {
    this.appendUnique(`resolve.extensions`, `.${extension}`)
  }
  addPlugin(plugin: PluginInput, options?: unknown) {
    this.addClassOrInstance(`plugins`, plugin, options)
  }
  addResolveAlias(virtualFolder: string, ...replacements: string[]) {
    this.setDefault(`resolve.alias`, {})
    const replacementsNormalized = replacements.map(replacement => this.fromContextFolder(replacement))
    this.config.resolve!.alias![virtualFolder] = replacementsNormalized
  }
  addResolvePlugin(plugin: PluginInput, options?: unknown) {
    this.addClassOrInstance(`resolve.plugins`, plugin, options)
  }
  addRule(testerInput: TesterInput, ...loaders: RuleSetUse[]) {
    this.append(`module.rules`, {
      test: compileTester(testerInput),
      use: loaders,
    })
  }
  append(key: Key, value: unknown) {
    const array = this.getEnsuredArray(key)
    array.push(value)
  }
  appendUnique(key: Key, value: unknown) {
    const array = this.getEnsuredArray(key)
    if (!array.includes(value)) {
      array.push(value)
    }
  }
  async build() {
    if (this.isDevelopment) {
      await this.buildDevelopment()
    } else {
      await this.buildProduction()
    }
    this.setDefault(`mode`, this.mode)
    this.setDefault(`target`, `web`)
    this.setDefault(`output.path`, this.outputFolder)
    return this.config
  }
  async buildDevelopment() {}
  async buildProduction() {}
  fromContextFolder(...pathSegments: string[]) {
    return path.join(this.contextFolder, ...pathSegments)
  }
  fromOutputFolder(...pathSegments: string[]) {
    return path.join(this.outputFolder, ...pathSegments)
  }
  get(key: Key) {
    return <unknown> lodash.get(this.config, key)
  }
  getDefaultOptions(): OptionsGeneric {
    return <OptionsGeneric> {
      contextFolder: `.`,
      env: process.env.NODE_ENV ?? `development`,
      outputFolder: `out/package`,
    }
  }
  getEnsuredArray(key: Key) {
    const array = <unknown[] | undefined> this.get(key)
    if (Array.isArray(array)) {
      return array
    }
    const value = []
    this.set(key, value)
    return value
  }
  has(key: Key) {
    return lodash.has(this.config, key)
  }
  mergeOptions(options: Partial<OptionsGeneric>, defaultOptions: Partial<OptionsGeneric>): OptionsGeneric {
    return <OptionsGeneric> Object.assign({}, defaultOptions, options)
  }
  normalizeOptions(options: (OptionsGeneric)): (OptionsGeneric) | void {}
  prepend(key: Key, value: unknown) {
    const array = this.getEnsuredArray(key)
    array.unshift(value)
  }
  prependUnique(key: Key, value: unknown) {
    const array = this.getEnsuredArray(key)
    if (!array.includes(value)) {
      array.unshift(value)
    }
  }
  set(key: Key, value) {
    lodash.set(this.config, key, value)
  }
  setDefault(key: Key, value: unknown) {
    if (!this.has(key)) {
      this.set(key, value)
    }
  }
  setExtensionAlias(extension: string, ...extensions: string[]) {
    this.setDefault(`resolve.extensionAlias`, {})
    const normalizedExtension = `.${extension}`
    const normalizedExtensions = extensions.map(extensionsEntry => `.${extensionsEntry}`)
    this.config.resolve!.extensionAlias![normalizedExtension] = normalizedExtensions
  }
}
