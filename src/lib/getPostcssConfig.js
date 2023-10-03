import pluginCenter from "postcss-center"
import pluginEasings from "postcss-easings"
import pluginImport from "postcss-import"
import pluginNested from "postcss-nested"
import pluginOrderedValues from "postcss-ordered-values"
import pluginSorting from "postcss-sorting"

const pluginMap = {
  nested: pluginNested,
  easings: pluginEasings,
  import: pluginImport,
  center: pluginCenter,
  sorting: pluginSorting,
  orderedValues: pluginOrderedValues,
}

export default options => {
  const plugins = []

  const addPlugin = (pluginName, pluginOptions) => {
    const plugin = pluginMap[pluginName](pluginOptions)
    plugins.push(plugin)
  }

  addPlugin("nested") // Resolves nested blocks
  addPlugin("easings") // Translates some easings from http://easings.net/
  addPlugin("import") // Inlines @import statements
  addPlugin("center") // Adds "top: center" and "left: center"

  if (!options.development) {
    // Sorts property names alphabetically
    addPlugin("sorting", {
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
    addPlugin("orderedValues") // Sorts arguments of properties, border for example
  }

  return {
    postcssOptions: {
      plugins,
    },
  }
}