import type {Options as BaseOptions} from './CommonConfigBuilder.js'
import type {Options as TsLoaderOptions} from 'ts-loader'

import {CommonConfigBuilder} from './CommonConfigBuilder.js'
import TypescriptDeclarationPlugin from 'typescript-declaration-webpack-plugin'

export type Options = BaseOptions & {}

export class LibConfigBuilder extends CommonConfigBuilder {
  constructor(options: Partial<Options> = {}) {
    super(options)
  }
  async buildProduction() {
    await super.buildProduction()
    this.addPlugin(TypescriptDeclarationPlugin, {
      removeComments: false,
    })
  }
  getTsLoaderOptions(): Partial<TsLoaderOptions> {
    if (this.isDevelopment) {
      return super.getTsLoaderOptions()
    }
    return Object.assign({}, super.getTsLoaderOptions(), {
      compilerOptions: {
        declaration: true,
        declarationDir: this.fromOutputFolder(`.types`),
      },
    })
  }
}
