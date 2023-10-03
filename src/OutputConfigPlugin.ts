import type {Compiler, WebpackPluginInstance} from 'webpack'

export class OutputConfigPlugin implements WebpackPluginInstance {
  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tap(`OutputConfigPlugin`, () => {
      console.dir(compiler.options)
    })
  }
}
