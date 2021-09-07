exports.default = ({meta}) => {
  const config = {
    backgroundColor: "13061b",
    esm: true,
  }
  if (meta.hmr) {
    config.devPort = 12_127
  }
  return config
}