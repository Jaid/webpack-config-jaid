import {BannerPlugin} from "webpack"

export const webpackConfig = () => ({
  target: "node",
  optimization: {
    nodeEnv: false,
  },
  output: {
    filename: "cli.js",
  },
  plugins: [
    new BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
    }),
  ],
})