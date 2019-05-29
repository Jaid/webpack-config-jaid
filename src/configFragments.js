import webpackMerge from "webpack-merge"
import {DefinePlugin} from "webpack"

export const binaryAssetTest = /\.(png|jpg|jpeg|webp|gif|ico|svg|woff2|ttf|eot|otf|mp4|flv|webm|mp3|flac|ogg|m4a|aac)$/

export const commonTerserOptions = {
  compress: {
    passes: process.env.TRAVIS_TAG ? 10 : 1,
    unsafe_comps: true,
    unsafe_math: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true
  },
  output: {
    ecma: 8,
    comments: (astTop, astToken) => /^!.+jaid\.jsx@gmail\.com/s.test(astToken.value),
  },
}

export const configureNode = webpackConfig => webpackMerge.smart({
  target: "node",
  optimization: {
    nodeEnv: false,
  },
  node: {
    __dirname: false,
    __filename: false,
    process: false,
    Buffer: false,
    setImmediate: false,
  },
  module: {
    rules: [
      {
        test: binaryAssetTest,
        use: "buffer-loader",
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      "process.browser": false,
    }),
  ],
}, webpackConfig)