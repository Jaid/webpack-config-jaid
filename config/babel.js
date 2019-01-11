const isDevelopment = process.env.NODE_ENV !== "production"

config = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          node: "8.15.0", // https://github.com/nodejs/Release#release-schedule
        },
      },
    ],
  ],
  plugins: ["@babel/proposal-optional-chaining"],
}

if (isDevelopment) {
  config.sourceMaps = "inline"
} else {
  config.comments = false
  config.presets.push("minify")
  config.plugins.push("module:faster.js")
}

module.exports = config