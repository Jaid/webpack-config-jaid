export default ({meta}) => {
  const config = {
    backgroundColor: "13061b",
  }
  if (meta.hmr) {
    config.devPort = 12_127
  }
  return config
}