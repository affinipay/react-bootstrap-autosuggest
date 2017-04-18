import { remove as removeDiacritics } from 'diacritics'
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
const Country = require('raw-loader!../examples/Country').trim()

export default class ItemsAsValuesSection extends React.Component {
  constructor(...args) {
    super(...args)
    this.state = {
      country: null
    }
    this._onCountryChange = this._onCountryChange.bind(this)
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }

  render() {
    return (
      <div>
        <h3><Anchor id="items-as-values">Items as values</Anchor></h3>
        <p>
          In the previous examples, the value supplied to the <code>value</code> property
          and received from the <code>onChange</code> event was the string value used in
          the input element. In cases where the datalist items are objects, it may be more
          natural to exchange item objects directly. Specifying the boolean property
          <code>valueIsItem</code> enables this mode of operation.
        </p>
        <h5><Anchor id="datalist-only">Datalist-only constraint</Anchor></h5>
        <p>
          A typical usage of this feature is object selection, where the object must be
          an item from the datalist. To enforce this constraint, the boolean
          property <code>datalistOnly</code> can also be specified. Not only does this
          option force the final value of the Autosuggest to come from the datalist, it
          also auto-completes the input value as soon as it matches only a single item.
          (Alternatively, if dynamic creation of objects based on the input value is
          desired, <code>ItemAdapter.newFromValue()</code> can be overridden to customize
          the object provided to the <code>onChange</code> and <code>onSelect</code> handlers.
          By default, the input value string itself is provided.)
        </p>
        <h5><Anchor id="datalist-object">Datalist as object</Anchor></h5>
        <p>
          This example also demonstrates the use of a datalist that is an object (as opposed
          to an array). In this case, the enumerable, owned properties of the object are
          used to derive the items of the datalist. By default, each item
          has <code>key</code> and <code>value</code> properties assigned to the name and
          value, respectively, of the corresponding property. As discussed above, the
          name of the value property can be changed using the <code>itemValuePropName</code> property
          of the Autosuggest (which this example does). The name of the key property is determined by
          the <a href="#list-adapter">datalist adapter</a>, where the default name <code>key</code> is
          designed to match the default value of the <code>itemReactKeyPropName</code> property.
        </p>
        <h5><Anchor id="value-folding">Value folding</Anchor></h5>
        <p>
          Finally, this example demonstrates custom value folding by overriding <code>ItemAdapter.foldValue()</code>.
          By default, only case-folding is performed, which means that the input value and each
          item value are converted to lower-case before comparison. This example also
          performs <a href="http://alistapart.com/article/accent-folding-for-auto-complete">diacritic-folding</a> by
          converting each accented character to one or more base/ASCII characters.
          However, since diacritic-folding can be performed in many different ways,
          it is not built into the Autosuggest component. Note that the folded names
          are also used as sort keys, which avoids the need to use the relatively
          slow <code>localeCompare</code> function when sorting.
        </p>
        <Playground
          code={Country}
          codeFolding
          lineNumbers
          scope={{
            Autosuggest,
            ItemAdapter,
            ControlLabel,
            FormControl,
            FormGroup,
            country: this.state.country,
            onChange: this._onCountryChange,
            removeDiacritics
          }} />
      </div>
    )
  }

  // autobind
  _onCountryChange(item) {
    this.setState({ country: item })
  }
}
