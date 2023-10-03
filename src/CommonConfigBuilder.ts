import type {Options as ParentOptions} from './ConfigBuilder.js'
import type {Options as TsLoaderOptions} from 'ts-loader'
import type {PackageJson} from 'type-fest'

import {ConfigBuilder} from './ConfigBuilder.js'
import {OutputConfigPlugin} from './OutputConfigPlugin.js'
import TypescriptDeclarationPlugin from 'typescript-declaration-webpack-plugin'

import normalizePackageData from '~/lib/normalizePackageData.js'

export type Options = {
  pkg?: PackageJson | string
}

const tempTypesFolder = `.types`

export class CommonConfigBuilder extends ConfigBuilder<Options> {
  protected pkg: PackageJson | undefined
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
  getDefaultOptions(): ParentOptions<Options> {
    const defaultOptions = super.getDefaultOptions()
    return {
      ...defaultOptions,
      pkg: `package.json`,
    }
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
