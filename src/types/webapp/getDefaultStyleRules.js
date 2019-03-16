import getPostcssConfig from "./getPostcssConfig"

export default options => {
  const cssLoader = {
    loader: "css-loader",
    options: {
      sourceMap: options.development,
      modules: true,
      localIdentName: options.development ? "[folder]_[local]_[hash:base62:4]" : "[hash:base64:6]",
    },
  }

  const postcssLoader = {
    loader: "postcss-loader",
    options: getPostcssConfig(options),
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
          use: [
            cssLoader,
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
  }
}