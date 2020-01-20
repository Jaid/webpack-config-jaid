import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"

/**
  * @typedef {{
  *   className: *,
  *   count: number
  * }} Props
  */

/**
  * @class
  * @extends {React.Component<Props>}
  */
class MyReactComponent extends React.Component {

  render() {
    const string = this.props.text
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
  text: PropTypes.string,
}

export default MyReactComponent