import webpackMerge from "webpack-merge"

export const binaryAssetTest = /\.(png|jpg|jpeg|webp|gif|ico|svg|woff2|ttf|eot|otf|mp4|flv|webm|mp3|flac|ogg|m4a|aac)$/

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
}, webpackConfig)