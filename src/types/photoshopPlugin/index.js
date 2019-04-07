import {j2xParser as XmlWriter} from "fast-xml-parser"
import webpack from "webpack"

export const defaultOptions = () => ({
  nodeExternals: false,
})

export const webpackConfig = ({pkg, options}) => ({
  target: "node",
  optimization: {
    nodeEnv: false,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: new XmlWriter().parse({
        javascriptresource: {
          name: options.title || pkg?.name || "package",
          category: "Jaid",
          enableinfo: true,
          about: pkg?.description || "Photoshop plugin",
          eventid: `nodePackage:${pkg?.author?.name || "jaid"}/${pkg?.name || "package"}`,
          // menu
          // terminology
          // type
        },
      }),
      entryOnly: true,
    }),
  ],
})