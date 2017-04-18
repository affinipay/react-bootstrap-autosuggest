import React from 'react'
import {
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap'
import Autosuggest, { ListAdapter } from 'react-bootstrap-autosuggest'
import Anchor from './Anchor'
import Playground from './Playground'
const Note = require('raw-loader!../examples/Note').trim()

const scope = {
  Autosuggest,
  ListAdapter,
  ControlLabel,
  FormControl,
  FormGroup
}

export default function ListAdapterSection() {
  return (
    <div>
      <h3><Anchor id="list-adapter">List adapters</Anchor></h3>
      <p>
        As shown in the previous example, the <code>datalist</code> property need not be
        an array. In addition to arrays, Autosuggest has built-in support for map-like objects
        and <a href="http://www.ecma-international.org/ecma-262/6.0/#sec-map-objects">ECMAScript 2015 Map objects</a>.
        Internally, an array of items is constructed from the datalist using a subclass
        of <a href="https://github.com/affinipay/react-bootstrap-autosuggest/tree/master/src/ListAdapter.js"><code>ListAdapter</code></a>.
        Normally, the list adapter is selected automatically if the datalist is an array,
        object, or map, but it can be specified explicitly using the <code>datalistAdapter</code> property.
        The built-in list adapter types are:
      </p>
      <ul>
        <li><code>EmptyListAdapter</code> (used when <code>datalist == null</code>)</li>
        <li><code>ArrayListAdapter</code> (used when <code>Array.isArray(datalist)</code>)</li>
        <li><code>MapListAdapter</code> (used when <code>datalist instanceof Map</code>)</li>
        <li><code>ObjectListAdapter</code> (used when <code>typeof datalist === 'object'</code> and
          the other conditions are false)</li>
      </ul>
      <h5><Anchor id="keyed-list-adapter">Keyed list adapters</Anchor></h5>
      <p>
        As mentioned <a href="#datalist-object">above</a>, the datalist items for objects and
        maps are objects with key and value properties corresponding to the datalist object
        property names/values or the datalist map entry keys/values, respectively.
        (The name of the key property is specified by the datalist adapter and defaults
        to <code>key</code>; the name of the value property is specified by
        the <code>itemValuePropName</code> property and defaults to <code>value</code>.)
        If the value of the property/entry is already an object with a value property,
        that object is used as the basis of the item object.
        If it also has a key property equal to the property name/entry key, it is used as the
        item object directly (and thus retains object identity). Otherwise, the object is cloned
        and the key property is set.
      </p>
      <Playground
        code={Note}
        codeFolding
        lineNumbers
        scope={scope} />
    </div>
  )
}
