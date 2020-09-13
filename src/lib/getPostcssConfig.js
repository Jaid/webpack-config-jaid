export default options => {
  const plugins = []

  const addPlugin = (pluginName, pluginOptions) => {
    if (pluginName[0] === "-") {
      pluginName = `postcss${pluginName}`
    }
    let plugin
    try {
      plugin = __non_webpack_require__(pluginName)(pluginOptions)
    } catch {
      plugin = require(pluginName)(pluginOptions)
    }
    plugins.push(plugin)
  }

  addPlugin("-nested") // Resolves nested blocks
  addPlugin("-preset-env") // Adds a bunch of CSS features
  addPlugin("-easings") // Translates some easings from http://easings.net/
  addPlugin("-import") // Inlines @import statements
  addPlugin("-center") // Adds "top: center" and "left: center"

  if (!options.development) {
    // Sorts property names alphabetically
    addPlugin("-sorting", {
      order: [
        "custom-properties",
        "dollar-variables",
        "declarations",
        "rules",
        "at-rules",
      ],
      "properties-order": [
        "content",
        "display",
        "flex",
        "width",
        "height",
        "margin",
        "padding",
      ],
      "unspecified-properties-position": "bottomAlphabetical",
    })
    addPlugin("-ordered-values") // Sorts arguments of properties, border for example
  }

  return {
    postcssOptions: {
      plugins,
    },
  }
}