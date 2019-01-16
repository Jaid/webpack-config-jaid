module.exports = ({config, options, pkg}) => {
  if (pkg.dependencies) {
    config.externals = Object.keys(pkg.dependencies)
  }

  if (options.type === "lib") {
    Object.assign(config.output, {
      ...config.output,
      libraryTarget: "commonjs2", // I don't know the difference to "umd" (it's not documented anywhere), but it has a "2" in it so it MUST be better! :D
    })
  }
}