import webpackConfigJaid from "./src"

export default webpackConfigJaid({
  documentation: true,
  publishimo: {
    publishimoOptions: {
      fetchGithub: true,
    },
  },
})