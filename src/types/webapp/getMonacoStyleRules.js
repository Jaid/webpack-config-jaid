import MonacoEditorPlugin from "monaco-editor-webpack-plugin"
import {isObject} from "lodash"

import getPostcssConfig from "./getPostcssConfig"

export default (options, fromRoot) => {
  const monacoPath = fromRoot("node_modules", "monaco-editor")

  const cssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      modules: true,
      localIdentName: options.development ? "[folder]_[local]_[hash:base62:4]" : "[hash:base64:6]",
    },
  }

  const nonModulesCssLoader = {...cssLoader}
  nonModulesCssLoader.options.modules = false

  const postcssLoader = {
    loader: "postcss-loader",
    options: getPostcssConfig(options),
  }

  const monacoEditorPluginOptions = isObject(options.includeMonacoEditor) ? options.includeMonacoEditor : {
    languages: ["javascript", "json"],
  }

  return {
    module: {
      rules: [
        {
          test: /\.(css|postcss|scss)$/,
          use: {
            loader: "style-loader",
            options: {
              hmr: options.development,
              singleton: !options.development,
            },
          },
        },
        {
          test: /\.(css|postcss)$/,
          exclude: monacoPath,
          use: [
            cssLoader,
            postcssLoader,
          ],
        },
        {
          test: /\.(css|postcss)$/,
          include: monacoPath,
          use: [
            nonModulesCssLoader,
            postcssLoader,
          ],
        },
        {
          test: /\.scss$/, // scss without local css-modules
          use: [
            cssLoader,
            postcssLoader,
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [new MonacoEditorPlugin(monacoEditorPluginOptions)],
  }
}