import shallowEqual from 'fbjs/lib/shallowEqual'
import React from 'react'
import {
  Alert,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock
} from 'react-bootstrap'
import Autosuggest from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
import SizeSelect from './SizeSelect'
import ValidationSelect from './ValidationSelect'
const Browser = require('raw!../examples/Browser').trim()

export default class ReactBootstrapSection extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      browser: '',
      bsSize: 'large',
      validationState: 'error'
    }
    this._onBrowserChange = this._onBrowserChange.bind(this)
    this._onBsSizeChange = this._onBsSizeChange.bind(this)
    this._onValidationChange = this._onValidationChange.bind(this)
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }

  render() {
    return (
      <div>
        <h3><Anchor id="react-bootstrap">React-Bootstrap integration</Anchor></h3>
        <p>
          In addition to being built on React and Bootstrap directly, Autosuggest is designed
          to leverage <a href="https://react-bootstrap.github.io/">React-Bootstrap</a> components
          when building complete <a href="https://react-bootstrap.github.io/components.html#forms">forms</a>.
          This example demonstrates its support for input group sizing and for validation state styling and feedback icons
          inherited from the containing <a href="https://react-bootstrap.github.io/components.html#forms-props-form-group">
          <code>&lt;FormGroup&gt;</code></a> component.
        </p>
        <SizeSelect
          value={this.state.bsSize || ''}
          onChange={this._onBsSizeChange} />
        <ValidationSelect
          value={this.state.validationState || ''}
          onChange={this._onValidationChange} />
        <Playground
          code={Browser}
          scope={{
            Autosuggest,
            ControlLabel,
            FormControl,
            FormGroup,
            HelpBlock,
            browser: this.state.browser,
            bsSize: this.state.bsSize,
            onChange: this._onBrowserChange,
            validationState: this.state.validationState
          }} />
        <Alert bsStyle="warning">
          <p>
            The feedback icon size and position are based on the <code>bsSize</code> property
            of the containing <code>FormGroup</code>, not of the Autosuggest, so don't forget
            to set both properties to the same value.
          </p>
        </Alert>
      </div>
    )
  }

  // autobind
  _onBrowserChange(value) {
    this.setState({ browser: value })
  }

  // autobind
  _onBsSizeChange(event) {
    this.setState({ bsSize: event.target.value || undefined })
  }

  // autobind
  _onValidationChange(event) {
    this.setState({ validationState: event.target.value || undefined })
  }
}
