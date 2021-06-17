exports.default = ({meta}) => {
  const config = {
    backgroundColor: "13061b",
    publicPath: ".",
  }
  if (meta.hmr) {
    config.devPort = 1212
  }
  return config
}