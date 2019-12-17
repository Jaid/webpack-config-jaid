import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import {connect} from "react-redux"

import css from "./style.scss"

@connect(({main}) => ({
  count: main.text?.length||0,
}))
export default class extends React.Component {

  static propTypes = {
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.object),
    ]),
    input: PropTypes.object.isRequired,
  }

  handleChange(event) {
    console.log("Change: ", event)
    this.props.input.onChange(event)
  }

  render() {
    return <div className={classnames(css.container, this.props.className)}>
      <input type="text" onChange={this.handleChange.bind(this)}/>
    </div>
  }

}