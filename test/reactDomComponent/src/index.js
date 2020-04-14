/** @module react-dom-component */

import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"

/**
  * @typedef {Object} Props
  * @prop {*} className
  * @prop {Number} textLength
  * @prop {string} text
  */

/**
  * @class
  * @extends {React.Component<Props>}
  */
class MyReactComponent extends React.Component {

  render() {
    const string = this.props.text.slice(0, this.props.textLength)
    return React.createElement("span", {className: classnames("myclass", this.props.className)}, string)
  }

}

MyReactComponent.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.object),
  ]),
  text: PropTypes.string.isRequired,
  textLength: PropTypes.number,
}

MyReactComponent.defaultProps = {
  textLength: 3,
}

export default MyReactComponent