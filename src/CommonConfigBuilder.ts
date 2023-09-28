import type {Options as TsLoaderOptions} from 'ts-loader'
import TypescriptDeclarationPlugin from 'typescript-declaration-webpack-plugin'

import type {Options as BaseOptions} from './ConfigBuilder.js'
import {ConfigBuilder} from './ConfigBuilder.js'
import {OutputConfigPlugin} from './OutputConfigPlugin.js'

export type Options = BaseOptions & {}

const tempTypesFolder = `.types`

export class CommonConfigBuilder extends ConfigBuilder {
  constructor(options: Partial<Options> = {}) {
    super(options)
  }
  async build() {
    this.set(`mode`, this.mode)
    this.set(`target`, `web`)
    this.set(`experiments.futureDefaults`, true)
    this.addExtension(`ts`)
    this.addPlugin(OutputConfigPlugin)
    this.addRule(`ts`, {
      loader: `ts-loader`,
      options: this.getTsLoaderOptions(),
    })
    this.setExtensionAlias(`js`, `ts`, `js`)
    this.addResolveAlias(`~/lib`, `lib`)
    this.addResolveAlias(`~/src`, `src`)
    this.addResolveAlias(`~/etc`, `etc`)
    this.addResolveAlias(`~/root`, `.`)
    return super.build()
  }
  async buildDevelopment() {
    this.set(`devtool`, `inline-source-map`)
  }
  async buildProduction() {
    this.set(`optimization.minimize`, false)
    this.set(`output.clean`, true)
  }
  getDefaultOptions(): Partial<Options> {
    const defaultOptions = super.getDefaultOptions()
    return Object.assign({}, defaultOptions, {
      outputFolder: undefined,
    })
  }
  getTsLoaderOptions(): Partial<TsLoaderOptions> {
    const tsLoaderOptions: Partial<TsLoaderOptions> = {
      onlyCompileBundledFiles: true,
    }
    if (this.isDevelopment) {
      tsLoaderOptions.transpileOnly = true
    } else {
      tsLoaderOptions.compilerOptions = {
        declaration: true,
        declarationDir: this.fromOutputFolder(tempTypesFolder),
      }
    }
    return tsLoaderOptions
  }
  normalizeOptions(options: Options): Options {
    const patch: Partial<Options> = {}
    if (options.outputFolder === undefined) {
      const mode = options.env === `production` ? `production` : `development`
      patch.outputFolder = `out/package/${mode}`
    }
    return Object.assign({}, options, patch)
  }
}
