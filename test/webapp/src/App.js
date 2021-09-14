import "modern-normalize"
import "./global.scss"

import React from "react"
import PictureModule from "react-modern-picture"

import icon from "./perk.png"
import css from "./style.sass"

const Picture = PictureModule.default // TODO Remove again when react-modern-picture will be ESM

// eslint-disable-next-line
const info = `This is a ${process.browser ? "browser" : "non-browser"} environment with user-agent ${navigator.userAgent}`

export default class App extends React.Component {

  render() {
    const titleElement = React.createElement("div", {
      key: "title",
      className: css.text,
    }, "App")
    const infoElement = React.createElement("div", {
      key: "info",
      className: css.text,
      id: "info",
    }, info)
    const pictureElement = React.createElement(Picture, {input: icon})
    const pictureContainerElement = React.createElement("div", {className: css.text}, pictureElement)
    const containerElement = React.createElement("div", {className: css.container}, [titleElement, infoElement, pictureContainerElement])
    // jsx not enabled here
    // return <div className={css.container}>
    //   <div className={css.text}>App</div>
    //   <div className={css.text} id="info">{info}</div>
    //   <div>
    //     <Picture input={icon}/>
    //   </div>
    // </div>
    return containerElement
  }

}