import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import {connect} from "react-redux"

import css from "./style.scss"

@connect(state => ({
  loginInfo: state.login,
}))
export default class extends React.Component {

  static propTypes = {
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
  }

  render() {
    const content = "hello"
    return <div className={classnames(css.container, this.props.className)}>
      {content}
    </div>
  }

}