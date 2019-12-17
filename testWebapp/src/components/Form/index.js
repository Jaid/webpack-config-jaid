import classnames from "classnames"
import PropTypes from "prop-types"
import React from "react"
import {connect} from "react-redux"
import {Field, reduxForm} from "redux-form"
import Input from "components/Input"

import css from "./style.scss"

@reduxForm({
  form: "controls",
})
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
    return <form>
      <Field component={Input} name="input"/>
    </form>
  }

}