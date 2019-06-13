import {configureNodeLib} from "./src"

export default configureNodeLib({
  documentation: {babel: true},
  publishimo: {fetchGithub: true},
  terserOptions: false,
})