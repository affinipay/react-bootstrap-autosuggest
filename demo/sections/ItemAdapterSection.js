import shallowEqual from 'fbjs/lib/shallowEqual'
import React from 'react'
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'
import Autosuggest, { ItemAdapter } from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
const StateProvince = require('raw!../examples/StateProvince').trim()

export default class ItemAdapterSection extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      stateValue: '',
      stateItem: null
    }
    this._onStateChange = this._onStateChange.bind(this)
    this._onStateSelect = this._onStateSelect.bind(this)
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }

  render() {
    return (
      <div>
        <h3><Anchor id="item-adapter">Item adapters</Anchor></h3>
        <p>
          As mentioned in the previous example, the <code>datalist</code> property
          can contain arbitrary objects. By default, Autosuggest looks for a property
          called <code>value</code> on each item and displays <code>value.toString()</code> in
          the drop-down menu and (when an item is selected) in the input element.
          If no value property is defined, <code>toString()</code> is called on the
          item itself. The name of the value property can be overridden using
          the <code>itemValuePropName</code> property of the Autosuggest.
        </p>
        <p>
          Similarly, the <code>key</code> property of the object is used as the React
          element key in the drop-down menu, and the <code>sortKey</code> property is
          used for sorting the menu items. These property names can be overridden using
          the <code>itemReactKeyPropName</code> and <code>itemSortKeyPropName</code> properties,
          respectively. If these properties are not defined on a given object, the
          value property is used instead (after being converted to a string, unless
          it is a number).
        </p>
        <p>
          If a finer degree of control is desired, the <code>itemAdapter</code> property
          can be set to an application-provided subclass of
          the <a href="https://github.com/affinipay/react-bootstrap-autosuggest/tree/master/src/ItemAdapter.js"><code>ItemAdapter</code></a> class.
          In the example below, in addition to overriding the value and React key property
          names, an item adapter is provided to allow multiple text representations (state
          abbreviation as well as name) and to customize the drop-down menu item rendering
          (including <a href="http://www.906graphics.com/2011/04/50-free-u-s-state-vector-icons/">US state images</a>).
        </p>
        <p>
          Finally, this example also shows that while <code>onChange</code> is (generally)
          called with the input value, <code>onSelect</code> is called with datalist items.
          This feature allows the application to receive additional item information, such
          as an ID or database key, that is not present in the input value. In this example,
          if a US state is selected, its postal code is shown.
        </p>
        <Playground
          code={StateProvince}
          codeFolding
          lineNumbers
          scope={{
            Autosuggest,
            ItemAdapter,
            ControlLabel,
            FormControl,
            FormGroup,
            stateValue: this.state.stateValue,
            stateItem: this.state.stateItem,
            onChange: this._onStateChange,
            onSelect: this._onStateSelect
          }} />
      </div>
    )
  }

  // autobind
  _onStateChange(value) {
    this.setState({ stateValue: value })
  }

  // autobind
  _onStateSelect(item) {
    this.setState({ stateItem: item })
  }
}
