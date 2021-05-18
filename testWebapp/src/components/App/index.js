import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import {connect} from "react-redux"
import Form from "components/Form"

import css from "./style.scss"

require('@lcdp/offline-plugin/runtime').install()

@connect(({form}) => ({
  count: form?.controls?.values?.input?.length || "?",
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
    return <div className={classnames(css.container, this.props.className)}>
      <Form/>
      <div className={css.counter}>Chars: {this.props.count}</div>
    </div>
  }

}