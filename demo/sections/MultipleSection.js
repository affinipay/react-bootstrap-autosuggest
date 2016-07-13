import shallowEqual from 'fbjs/lib/shallowEqual'
import React from 'react'
import {
  Alert,
  Button,
  Checkbox,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'
import Autosuggest, { ItemAdapter } from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
import SizeSelect from './SizeSelect'
const Tags = require('raw!../examples/Tags').trim()

export default class MultipleSection extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      tags: [{ value: 'Good' }, { value: 'Bad' }, { value: 'Ugly' }],
      allowDuplicates: false,
      datalistOnly: false,
      multiLine: false,
      bsSize: undefined
    }
    this._toggleDatalistOnly = this._toggleDatalistOnly.bind(this)
    this._toggleAllowDuplicates = this._toggleAllowDuplicates.bind(this)
    this._toggleMultiLine = this._toggleMultiLine.bind(this)
    this._onBsSizeChange = this._onBsSizeChange.bind(this)
    this._onTagsChange = this._onTagsChange.bind(this)
    this._onTagsClear = this._onTagsClear.bind(this)
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }

  render() {
    return (
      <div>
        <h3><Anchor id="multiple">Multiple selections</Anchor></h3>
        <p>
          Autosuggest supports selection of multiple options using a tag/pill style of
          user interface. The <code>allowDuplicates</code> boolean property (which defaults
          to false) controls whether an option can be selected more than once.
          Unless <code>datalistOnly</code> is enabled, arbitrary values can be selected by
          pressing <kbd>Enter</kbd> after typing them.
        </p>
        <p>
          The application can control the rendering of both the drop-down menu options and the selected
          items by overriding the <code>renderSuggested</code> and <code>renderSelected</code> methods,
          respectively, of the <code>ItemAdapter</code>. By default, both of these methods call
          the <code>renderItem</code> method, which can be overridden instead to use the same
          rendering in both contexts.
        </p>
        <p>
          Normally, the Autosuggest component maintains a fixed height (like other Bootstrap
          input elements). However, if the drop-down menu toggle is disabled and no input
          group add-ons are specified, the height of the component is allowed to grow as
          necessary to contain the selections.
        </p>
        <Checkbox
          checked={this.state.allowDuplicates}
          onChange={this._toggleAllowDuplicates}>
          Allow duplicates
        </Checkbox>
        <Checkbox
          checked={this.state.datalistOnly}
          onChange={this._toggleDatalistOnly}>
          Datalist-only
        </Checkbox>
        <Checkbox
          checked={this.state.multiLine}
          onChange={this._toggleMultiLine}>
          Multi-line (hides drop-down toggle and clear button)
        </Checkbox>
        <SizeSelect
          value={this.state.bsSize || ''}
          onChange={this._onBsSizeChange} />
        <Playground
          code={Tags}
          codeFolding
          lineNumbers
          scope={{
            Autosuggest,
            ItemAdapter,
            Button,
            ControlLabel,
            FormControl,
            FormGroup,
            tags: this.state.tags,
            allowDuplicates: this.state.allowDuplicates,
            datalistOnly: this.state.datalistOnly,
            multiLine: this.state.multiLine,
            bsSize: this.state.bsSize,
            onChange: this._onTagsChange,
            onClear: this._onTagsClear
          }} />
        <Alert bsStyle="warning">
          Due to Bootstrap's use of <a href="http://getbootstrap.com/css/#callout-has-feedback-icon-positioning">absolute
          positioning for feedback icons</a>, manual adjustment is necessary when using
          them in combination with add-ons or buttons at the end of the input group,
          such as the clear (&times;) button above.
        </Alert>
      </div>
    )
  }

  // autobind
  _toggleDatalistOnly() {
    this.setState({ datalistOnly: !this.state.datalistOnly })
  }

  // autobind
  _toggleAllowDuplicates() {
    this.setState({ allowDuplicates: !this.state.allowDuplicates })
  }

  // autobind
  _toggleMultiLine() {
    this.setState({ multiLine: !this.state.multiLine })
  }

  // autobind
  _onBsSizeChange(event) {
    this.setState({ bsSize: event.target.value || undefined })
  }

  // autobind
  _onTagsChange(items) {
    this.setState({ tags: items })
  }

  // autobind
  _onTagsClear() {
    this.setState({ tags: [] })
  }
}
