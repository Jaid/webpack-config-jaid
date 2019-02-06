import webpackConfigJaid from "./src"

export default webpackConfigJaid({
  publishimo: {
    publishimoOptions: {
      fetchGithub: true,
    },
  },
})