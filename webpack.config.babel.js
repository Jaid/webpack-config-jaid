const configure = require("./src").configureNodeLib

module.exports = configure({
  documentation: {babel: true},
  publishimo: {fetchGithub: true},
})