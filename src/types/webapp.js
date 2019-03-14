export const webpackConfig = ({
  module: {
    rules: [
      {
        test: /\.(css|postcss|scss)$/,
        use: {
          loader: "style-loader",
          options: {
            hmr: isDevelopment,
            singleton: !isDevelopment,
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
      {
        test: /\.(png|jpe?g|gif|svg|woff2|ico)$/,
        loader: "url-loader",
      },
      {
        test: /\.md$/,
        use: ["html-loader", "markdown-loader"],
      },
    ],
  },
})